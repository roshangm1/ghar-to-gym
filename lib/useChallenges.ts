import { db, id } from './instant';
import { Challenge } from '@/types';
import { createChallengePost } from './useSocialFeed';

/**
 * Hook to fetch all active challenges from InstantDB
 * Challenges are sorted by end date (soonest first)
 */
export function useChallenges(userId?: string | null) {
  const { data, isLoading } = db.useQuery({
    challenges: {
      $: {
        where: { isActive: true as any },
      },
      userProgress: {}, // Get user progress for each challenge
    },
  });

  const challenges: (Challenge & { hasJoined?: boolean; joinedAt?: number })[] = (data?.challenges || [])
    .map((challenge: any) => {
      // Find user's progress for this challenge
      const userProgress = userId
        ? challenge.userProgress?.find(
            (progress: any) => progress.userId === userId
          )
        : null;

      // Count total participants (all users who have progress on this challenge)
      const participants = challenge.userProgress?.length || 0;

      return {
        id: challenge.id,
        title: challenge.title,
        culturalName: challenge.culturalName,
        description: challenge.description,
        type: challenge.type as 'weekly' | 'monthly',
        goal: challenge.goal,
        progress: userProgress?.progress || 0,
        participants,
        endDate: challenge.endDate,
        reward: challenge.reward,
        metricType: (challenge.metricType || 'workout_count') as 'streak' | 'workout_count' | 'workout_count_weekly' | 'workout_count_monthly',
        category: challenge.category as any,
        hasJoined: !!userProgress,
        joinedAt: userProgress?.createdAt,
      };
    })
    .sort((a, b) => {
      // endDate is now an epoch number (timestamp)
      const endDateA = typeof a.endDate === 'number' ? a.endDate : new Date(a.endDate).getTime();
      const endDateB = typeof b.endDate === 'number' ? b.endDate : new Date(b.endDate).getTime();
      return endDateA - endDateB;
    });

  return {
    challenges,
    isLoading,
  };
}

/**
 * Get user's progress for a specific challenge
 */
export function useUserChallengeProgress(userId: string | null, challengeId: string) {
  const { data, isLoading } = db.useQuery(
    userId && challengeId
      ? {
          userChallengeProgress: {
            $: {
              where: {
                userId: userId as any,
                challengeId: challengeId as any,
              },
            },
          },
        }
      : {}
  );

  const progress = data?.userChallengeProgress?.[0] || null;

  return {
    progress: progress
      ? {
          id: progress.id,
          userId: progress.userId,
          challengeId: progress.challengeId,
          progress: progress.progress || 0,
          completed: progress.completed || false,
          completedAt: progress.completedAt || undefined,
        }
      : null,
    isLoading,
  };
}

/**
 * Join a challenge (create progress entry for user)
 */
export async function joinChallenge(
  userId: string,
  challengeId: string
): Promise<string> {
  try {
    // Check if user already has progress for this challenge
    const { data } = await db.queryOnce({
      userChallengeProgress: {
        $: {
          where: {
            userId: userId as any,
            challengeId: challengeId as any,
          },
        },
      },
    });

    if (data?.userChallengeProgress && data.userChallengeProgress.length > 0) {
      // User already joined, return existing progress ID
      return data.userChallengeProgress[0].id;
    }

    // Create new progress entry
    const progressId = id();
    await db.transact([
      db.tx.userChallengeProgress[progressId].update({
        userId,
        challengeId,
        progress: 0,
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
      // Link the progress to the user
      db.tx.users[userId].link({ challengeProgress: progressId }),
      // Link the progress to the challenge
      db.tx.challenges[challengeId].link({ userProgress: progressId }),
    ]);

    return progressId;
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Filter workout logs to only include those after the effective start date
 * (the later of challenge start date or user join date)
 * Dates are now epoch numbers (timestamps) with millisecond precision
 */
function filterLogsAfterStartDate(
  logs: any[],
  effectiveStartTimestamp: number
): any[] {
  // effectiveStartTimestamp is epoch number with millisecond precision
  // log.date is epoch number (timestamp) with millisecond precision
  return logs.filter((log: any) => {
    const logTimestamp = typeof log.date === 'number' ? log.date : new Date(log.date).getTime();
    return logTimestamp >= effectiveStartTimestamp;
  });
}

/**
 * Filter workout logs by category
 */
async function filterLogsByCategory(
  logs: any[],
  category: string
): Promise<any[]> {
  // Fetch all workouts to get category information
  const { data: workoutsData } = await db.queryOnce({
    workouts: {},
  });
  
  const workoutMap = new Map(
    (workoutsData?.workouts || []).map((w: any) => [w.id, w])
  );
  
  return logs.filter((log: any) => {
    const workout = workoutMap.get(log.workoutId);
    return workout && workout.category === category;
  });
}

/**
 * Get all relevant workout logs for a user, filtered by effective start date
 * (the later of challenge start date or user join date)
 * Dates are now epoch numbers (timestamps) with millisecond precision
 */
async function getRelevantWorkoutLogs(
  userId: string,
  effectiveStartTimestamp: number
): Promise<any[]> {
  const { data: logsData } = await db.queryOnce({
    workoutLogs: {
      $: {
        where: { userId: userId as any },
      },
    },
  });

  const allLogs = logsData?.workoutLogs || [];
  return filterLogsAfterStartDate(allLogs, effectiveStartTimestamp);
}

/**
 * Calculate workout streak (consecutive days with workouts)
 * workoutTimestamps are epoch numbers (timestamps)
 */
function calculateStreak(workoutTimestamps: number[]): number {
  if (workoutTimestamps.length === 0) return 0;
  
  // Get start of day for each timestamp and get unique days
  const uniqueDays = Array.from(new Set(
    workoutTimestamps.map(ts => {
      const date = new Date(ts);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  ));
  
  // Sort dates in descending order (most recent first)
  const sortedDays = uniqueDays.sort((a, b) => b - a);
  
  if (sortedDays.length === 0) return 0;
  
  // Check if most recent workout was today or yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  const yesterdayTimestamp = todayTimestamp - 24 * 60 * 60 * 1000;
  
  const mostRecentDay = sortedDays[0];
  
  // If most recent workout is not today or yesterday, streak is 0
  if (mostRecentDay !== todayTimestamp && mostRecentDay !== yesterdayTimestamp) {
    return 0;
  }
  
  // Calculate consecutive days
  let streak = 1;
  let expectedDay = mostRecentDay - 24 * 60 * 60 * 1000; // Previous day
  
  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = sortedDays[i];
    
    if (currentDay === expectedDay) {
      streak++;
      expectedDay -= 24 * 60 * 60 * 1000; // Previous day
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Get start date for weekly/monthly period
 * Returns epoch number (timestamp) at start of period (00:00:00)
 */
function getPeriodStart(type: 'weekly' | 'monthly'): number {
  const now = new Date();
  let start: Date;
  
  if (type === 'weekly') {
    // Start of current week (Sunday)
    const day = now.getDay();
    const diff = now.getDate() - day;
    start = new Date(now.getFullYear(), now.getMonth(), diff);
  } else {
    // Start of current month
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

/**
 * Get effective start date considering:
 * 1. Challenge start date (when challenge was created)
 * 2. User join date (when user joined the challenge)
 * 3. Period start (for weekly/monthly challenges)
 * Returns the latest of these dates as epoch number (timestamp) with millisecond precision
 */
function getEffectiveStartDate(
  challengeStartDate: string | number, // Challenge createdAt (ISO string or epoch number)
  userJoinDate: number, // User progress createdAt (epoch number)
  periodStart?: number // Optional period start (epoch number for weekly/monthly)
): number {
  // Convert challenge start date to epoch number with millisecond precision
  const challengeStartTimestamp = typeof challengeStartDate === 'string'
    ? new Date(challengeStartDate).getTime()
    : challengeStartDate;
  
  // Use full timestamp precision (no normalization to start of day)
  const challengeStartEpoch = challengeStartTimestamp;
  
  // Use full timestamp precision for user join date
  const joinDateEpoch = userJoinDate;
  
  // Start with the later of challenge start or user join date
  let effectiveStart = challengeStartEpoch > joinDateEpoch ? challengeStartEpoch : joinDateEpoch;
  
  // If period start is provided, use the latest of all three
  if (periodStart !== undefined) {
    effectiveStart = periodStart > effectiveStart ? periodStart : effectiveStart;
  }
  
  return effectiveStart;
}

// ============================================================================
// Progress Calculation Functions
// ============================================================================

/**
 * Calculate streak progress for a challenge
 * Only counts workouts after the effective start date (challenge start or user join, whichever is later)
 * log.date is now an epoch number (timestamp)
 */
async function calculateStreakProgress(
  logs: any[]
): Promise<number> {
  // Get workout timestamps from logs (already filtered by effective start date)
  const workoutTimestamps = logs
    .map((log: any) => {
      // Convert to epoch number if it's a string
      return typeof log.date === 'number' ? log.date : new Date(log.date).getTime();
    })
    .filter((ts: number) => ts && !isNaN(ts));
  
  return calculateStreak(workoutTimestamps);
}

/**
 * Calculate total workout count progress for a challenge
 * Only counts workouts after the effective start date (challenge start or user join, whichever is later)
 */
async function calculateWorkoutCountProgress(
  logs: any[],
  category?: string
): Promise<number> {
  let relevantLogs = logs;
  
  // Filter by category if specified
  if (category) {
    relevantLogs = await filterLogsByCategory(logs, category);
  }
  
  return relevantLogs.length;
}

/**
 * Calculate weekly workout count progress for a challenge
 * Only counts workouts after the effective start date and within current week
 * effectiveStart is now an epoch number (timestamp) with millisecond precision
 */
async function calculateWeeklyWorkoutCountProgress(
  logs: any[],
  effectiveStart: number,
  category?: string
): Promise<number> {
  // Filter logs to only include those within the effective period
  // Uses millisecond precision for accurate filtering
  let relevantLogs = logs.filter((log: any) => {
    const logTimestamp = typeof log.date === 'number' ? log.date : new Date(log.date).getTime();
    return logTimestamp >= effectiveStart;
  });
  
  // Filter by category if specified
  if (category) {
    relevantLogs = await filterLogsByCategory(relevantLogs, category);
  }
  
  return relevantLogs.length;
}

/**
 * Calculate monthly workout count progress for a challenge
 * Only counts workouts after the effective start date and within current month
 * effectiveStart is now an epoch number (timestamp) with millisecond precision
 */
async function calculateMonthlyWorkoutCountProgress(
  logs: any[],
  effectiveStart: number,
  category?: string
): Promise<number> {
  // Filter logs to only include those within the effective period
  // Uses millisecond precision for accurate filtering
  let relevantLogs = logs.filter((log: any) => {
    const logTimestamp = typeof log.date === 'number' ? log.date : new Date(log.date).getTime();
    return logTimestamp >= effectiveStart;
  });
  
  // Filter by category if specified
  if (category) {
    relevantLogs = await filterLogsByCategory(relevantLogs, category);
  }
  
  return relevantLogs.length;
}

// ============================================================================
// Challenge Completion Handler
// ============================================================================

/**
 * Handle challenge completion (award points and create social post)
 */
async function handleChallengeCompletion(
  userId: string,
  user: any,
  challenge: any
): Promise<void> {
  try {
    // Award points for completing challenge
    const pointsToAward = challenge.type === 'monthly' ? 500 : 250;
    await db.transact([
      db.tx.users[userId].update({
        points: (user.points || 0) + pointsToAward,
        updatedAt: Date.now(),
      }),
    ]);

    // Create social post if user preferences allow
    const userPreferences = user.preferences || {
      autoPost: true,
      shareWorkouts: true,
      shareMilestones: true,
      shareChallenges: true,
    };

    if (userPreferences.autoPost && userPreferences.shareChallenges) {
      await createChallengePost(
        userId,
        user.name,
        challenge.title,
        '🏆',
        user.avatar
      );
    }
  } catch (error) {
    console.error('Error handling challenge completion:', error);
    // Don't throw - challenge progress was updated, just post/points failed
  }
}

/**
 * Update user's progress in a challenge
 * This is typically called when a user completes a workout
 * Always ensures progress is only counted after the user's challenge createdAt date
 */
export async function updateChallengeProgress(
  userId: string,
  challengeId: string,
  workoutId?: string
): Promise<void> {
  try {
    // Get challenge and current progress
    const { data } = await db.queryOnce({
      userChallengeProgress: {
        $: {
          where: {
            userId: userId as any,
            challengeId: challengeId as any,
          },
        },
      },
      challenges: {
        $: {
          where: { id: challengeId as any },
        },
      },
      users: {
        $: {
          where: { id: userId as any },
        },
      },
    });

    const progress = data?.userChallengeProgress?.[0];
    const challenge = data?.challenges?.[0];
    const user = data?.users?.[0];

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (!user) {
      throw new Error('User not found');
    }

    // If user hasn't joined yet, create progress entry first
    if (!progress) {
      await joinChallenge(userId, challengeId);
      // Recursively call with updated progress
      return updateChallengeProgress(userId, challengeId, workoutId);
    }

    // Get the join date (createdAt) - only count workouts after this date
    const joinDate = progress.createdAt;
    if (!joinDate) {
      throw new Error('Progress entry missing createdAt date');
    }

    // Get challenge start date (when challenge was created)
    const challengeStartDate = challenge.createdAt;
    if (!challengeStartDate) {
      throw new Error('Challenge missing createdAt date');
    }

    // Calculate effective start date (later of challenge start or user join date)
    // For weekly/monthly, also consider period start
    // Returns epoch number (timestamp) with millisecond precision
    const metricType = challenge.metricType || 'workout_count';
    let effectiveStart: number;
    
    if (metricType === 'workout_count_weekly') {
      const periodStart = getPeriodStart('weekly');
      effectiveStart = getEffectiveStartDate(challengeStartDate, joinDate, periodStart);
    } else if (metricType === 'workout_count_monthly') {
      const periodStart = getPeriodStart('monthly');
      effectiveStart = getEffectiveStartDate(challengeStartDate, joinDate, periodStart);
    } else {
      // For streak and workout_count, just use challenge start or join date (whichever is later)
      effectiveStart = getEffectiveStartDate(challengeStartDate, joinDate);
    }

    // Get all relevant workout logs (filtered by effective start date)
    const relevantLogs = await getRelevantWorkoutLogs(userId, effectiveStart);

    // Calculate progress based on metric type
    const challengeCategory = challenge.category;
    let newProgress = 0;

    switch (metricType) {
      case 'streak':
        newProgress = await calculateStreakProgress(relevantLogs);
        break;

      case 'workout_count':
        newProgress = await calculateWorkoutCountProgress(
          relevantLogs,
          challengeCategory
        );
        break;

      case 'workout_count_weekly':
        newProgress = await calculateWeeklyWorkoutCountProgress(
          relevantLogs,
          effectiveStart,
          challengeCategory
        );
        break;

      case 'workout_count_monthly':
        newProgress = await calculateMonthlyWorkoutCountProgress(
          relevantLogs,
          effectiveStart,
          challengeCategory
        );
        break;

      default:
        console.warn(`Unknown metric type: ${metricType}, defaulting to workout_count`);
        newProgress = await calculateWorkoutCountProgress(
          relevantLogs,
          challengeCategory
        );
    }

    // Check if challenge is completed
    const goal = challenge.goal;
    const wasCompleted = progress.completed || false;
    const isNowCompleted = newProgress >= goal;

    // Update progress in database
    await db.transact([
      db.tx.userChallengeProgress[progress.id].update({
        progress: newProgress,
        completed: isNowCompleted,
        completedAt:
          isNowCompleted && !wasCompleted
            ? Date.now()
            : progress.completedAt,
        updatedAt: Date.now(),
      }),
    ]);

    // Handle challenge completion (award points, create social post)
    if (isNowCompleted && !wasCompleted) {
      await handleChallengeCompletion(userId, user, challenge);
    }
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    throw error;
  }
}

/**
 * Get leaderboard data - top users by points
 */
export function useLeaderboard(limit: number = 10) {
  const { data, isLoading } = db.useQuery({
    users: {},
  });

  const leaderboard = (data?.users || [])
    .map((user: any, index: number) => ({
      id: `l${index + 1}`,
      userId: user.userId,
      userName: user.name,
      points: user.points || 0,
      streak: user.workoutStreak || 0,
      avatar: user.avatar,
      rank: index + 1,
    }))
    .sort((a, b) => {
      // Sort by points first, then by streak
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.streak - a.streak;
    })
    .slice(0, limit);

  return {
    leaderboard,
    isLoading,
  };
}

