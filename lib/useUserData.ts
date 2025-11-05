import { db, id } from './instant';
import { UserProfile, WorkoutLog, Achievement } from '@/types';

export function useUserProfile() {
  const { user, isLoading: authLoading } = db.useAuth();
  const authUserId = user?.id;

  // Query users table by userId (which references $users.id)
  // Since $users is read-only, we query our custom users table directly
  const { data: userData, isLoading: userLoading } = db.useQuery(
    authUserId && authUserId.length > 0
      ? {
          users: {
            $: {
              where: { userId: authUserId } as any,
            },
          },
        }
      : {}
  );

  const userRecord = userData?.users?.[0] || null;

  // Get the custom user ID (our users table ID)
  const userId = userRecord?.id || null;

  const profile: UserProfile | null = userRecord
    ? {
        id: userRecord.userId, // This is the $users.id
        name: userRecord.name,
        email: userRecord.email,
        avatar: userRecord.avatar,
        workoutStreak: userRecord.workoutStreak || 0,
        totalWorkouts: userRecord.totalWorkouts || 0,
        points: userRecord.points || 0,
        goals: userRecord.goals || [],
        achievements: [], // Will be loaded separately
        customMetrics: userRecord.customMetrics || {
          energyLevel: 7,
          sleepQuality: 8,
        },
        weight: userRecord.customMetrics?.weight,
      }
    : null;

  return {
    profile,
    userId, // This is our custom users table ID
    isLoading: authLoading || userLoading,
  };
}

export function useUserWorkoutLogs() {
  const { user } = db.useAuth();
  const authUserId = user?.id;

  // Query users table by userId, then get workoutLogs via link
  const { data: userData } = db.useQuery(
    authUserId && authUserId.length > 0
      ? {
          users: {
            $: {
              where: { userId: authUserId } as any,
            },
            workoutLogs: {}, // Use the link to fetch workout logs
          },
        }
      : {}
  );

  const userRecord = userData?.users?.[0] || null;
  const logs: WorkoutLog[] =
    userRecord?.workoutLogs?.map((log: any) => ({
      id: log.id,
      workoutId: log.workoutId,
      date: log.date,
      duration: log.duration,
      caloriesBurned: log.caloriesBurned,
      energyBefore: log.energyBefore,
      energyAfter: log.energyAfter,
      notes: log.notes,
    })) || [];

  return { logs, isLoading: false };
}

export function useUserAchievements() {
  const { user } = db.useAuth();
  const authUserId = user?.id;

  // Query users table by userId, then get achievements via link
  const { data: userData } = db.useQuery(
    authUserId && authUserId.length > 0
      ? {
          users: {
            $: {
              where: { userId: authUserId } as any,
            },
            achievements: {}, // Use the link to fetch achievements
          },
        }
      : {}
  );

  const userRecord = userData?.users?.[0] || null;
  const achievements: Achievement[] =
    userRecord?.achievements?.map((ach: any) => ({
      id: ach.id,
      title: ach.title,
      description: ach.description,
      icon: ach.icon,
      unlockedDate: ach.unlockedDate,
    })) || [];

  return { achievements, isLoading: false };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<any>
): Promise<void> {
  try {
    const { data } = await db.queryOnce({
      users: {
        $: {
          where: { id: userId },
        },
      },
    });

    if (data?.users && data.users.length > 0) {
      await db.transact([
        db.tx.users[userId].update({
          ...updates,
          updatedAt: Date.now(),
        }),
      ]);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function logWorkoutToDB(
  userId: string,
  workoutLog: Omit<WorkoutLog, 'id'>
): Promise<string> {
  try {
    const logId = id();
    await db.transact([
      db.tx.workoutLogs[logId].update({
        userId,
        workoutId: workoutLog.workoutId,
        date: workoutLog.date,
        duration: workoutLog.duration,
        caloriesBurned: workoutLog.caloriesBurned,
        energyBefore: workoutLog.energyBefore,
        energyAfter: workoutLog.energyAfter,
        notes: workoutLog.notes,
        createdAt: Date.now(),
      }),
      // Link the workout log to the user (users table)
      db.tx.users[userId].link({ workoutLogs: logId }),
    ]);

    // Update user stats in users table
    const { data } = await db.queryOnce({
      users: {
        $: {
          where: { id: userId },
        },
      },
    });

    if (data?.users && data.users.length > 0) {
      const userRecord = data.users[0];
      
      const today = new Date().toISOString().split('T')[0];
      const customMetrics = userRecord.customMetrics || {};
      const lastWorkoutDate = customMetrics.lastWorkoutDate?.split('T')[0];
      const isNewDay = today !== lastWorkoutDate;

      let newStreak = userRecord.workoutStreak || 0;
      if (isNewDay) {
        if (
          lastWorkoutDate &&
          new Date(today).getTime() - new Date(lastWorkoutDate).getTime() ===
            24 * 60 * 60 * 1000
        ) {
          // Consecutive day - increment streak
          newStreak = (userRecord.workoutStreak || 0) + 1;
        } else {
          // Gap in days or first workout - reset streak to 1
          newStreak = 1;
        }
      }

      const updatedMetrics = {
        ...customMetrics,
        lastWorkoutDate: new Date().toISOString(),
        energyLevel: customMetrics.energyLevel ?? 7,
        sleepQuality: customMetrics.sleepQuality ?? 8,
      };

      const newTotalWorkouts = (userRecord.totalWorkouts || 0) + 1;
      const newPoints = (userRecord.points || 0) + 50;

      console.log('Updating user stats:', {
        userId,
        totalWorkouts: `${userRecord.totalWorkouts || 0} -> ${newTotalWorkouts}`,
        streak: `${userRecord.workoutStreak || 0} -> ${newStreak}`,
        points: `${userRecord.points || 0} -> ${newPoints}`,
      });

      await db.transact([
        db.tx.users[userId].update({
          totalWorkouts: newTotalWorkouts,
          workoutStreak: newStreak,
          points: newPoints,
          customMetrics: updatedMetrics,
          updatedAt: Date.now(),
        }),
      ]);

      // Check and unlock achievements
      await checkAndUnlockAchievements(userId, newStreak, newTotalWorkouts);
    } else {
      console.error('No profile found for userId:', userId);
      throw new Error('User profile not found. Please try logging out and back in.');
    }

    return logId;
  } catch (error) {
    console.error('Error logging workout:', error);
    throw error;
  }
}

async function checkAndUnlockAchievements(
  userId: string,
  streak: number,
  totalWorkouts: number
): Promise<void> {
  const achievementsToCheck = [
    {
      id: 'first_workout',
      condition: totalWorkouts === 1,
      title: 'First Workout',
      description: 'Completed your first workout',
      icon: '🎯',
    },
    {
      id: 'week_warrior',
      condition: streak >= 7,
      title: 'Week Warrior',
      description: '7 day streak achieved',
      icon: '🔥',
    },
    {
      id: 'month_master',
      condition: streak >= 30,
      title: 'Month Master',
      description: '30 day streak achieved',
      icon: '🏆',
    },
    {
      id: 'century_club',
      condition: totalWorkouts >= 100,
      title: 'Century Club',
      description: 'Completed 100 workouts',
      icon: '💯',
    },
  ];

  const { data } = await db.queryOnce({
    achievements: {
      $: {
        where: { userId },
      },
    },
  });

  const unlockedAchievementIds = new Set(
    (data?.achievements || []).map((a: any) => a.achievementId)
  );

  for (const achievement of achievementsToCheck) {
    if (
      achievement.condition &&
      !unlockedAchievementIds.has(achievement.id)
    ) {
      const achievementId = id();
      await db.transact([
        db.tx.achievements[achievementId].update({
          userId,
          achievementId: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          unlockedDate: new Date().toISOString(),
          createdAt: Date.now(),
        }),
        // Link the achievement to the user (users table)
        db.tx.users[userId].link({ achievements: achievementId }),
      ]);
    }
  }
}

export async function updateCustomMetric(
  userId: string,
  metric: 'energyLevel' | 'sleepQuality',
  value: number
): Promise<void> {
  try {
    const { data } = await db.queryOnce({
      users: {
        $: {
          where: { id: userId },
        },
      },
    });

    if (data?.users && data.users.length > 0) {
      const userRecord = data.users[0];
      const customMetrics = userRecord.customMetrics || {};

      await db.transact([
        db.tx.users[userId].update({
          customMetrics: {
            ...customMetrics,
            [metric]: value,
          },
          updatedAt: Date.now(),
        }),
      ]);
    }
  } catch (error) {
    console.error('Error updating custom metric:', error);
    throw error;
  }
}

/**
 * Get today's date as YYYY-MM-DD string
 */
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Hook to get a user's workout instance for today's session
 */
export function useUserWorkoutInstance(userId: string | null, workoutId: string) {
  const todayDate = getTodayDateString();
  
  const { data, isLoading } = db.useQuery(
    userId && workoutId
      ? {
          userWorkouts: {
            $: {
              where: {
                userId: userId as any,
                workoutId: workoutId as any,
                workoutDate: todayDate as any,
              },
            },
          },
        }
      : {}
  );

  const instances = data?.userWorkouts || [];
  
  // Prioritize in_progress instances, then most recent
  let instance = null;
  if (instances.length > 0) {
    // First, try to find an in_progress instance
    const inProgressInstance = instances.find((inst: any) => inst.status === 'in_progress');
    if (inProgressInstance) {
      instance = inProgressInstance;
    } else {
      // If no in_progress, get the most recent instance (by createdAt or updatedAt)
      instance = instances.reduce((latest: any, current: any) => {
        const latestTime = latest.updatedAt || latest.createdAt || 0;
        const currentTime = current.updatedAt || current.createdAt || 0;
        return currentTime > latestTime ? current : latest;
      });
    }
  }

  return {
    instance,
    isLoading,
    status: instance?.status || 'not_started',
    completedExercises: (instance?.completedExercises || []) as string[],
    workoutDate: instance?.workoutDate || todayDate,
  };
}

/**
 * Hook to get all active (in_progress) workout instances for today
 */
export function useActiveWorkouts(userId: string | null) {
  const todayDate = getTodayDateString();
  
  const { data, isLoading } = db.useQuery(
    userId
      ? {
          userWorkouts: {
            $: {
              where: {
                userId: userId as any,
                workoutDate: todayDate as any,
                status: 'in_progress' as any,
              },
            },
          },
        }
      : {}
  );

  const instances = data?.userWorkouts || [];
  
  // Extract workout IDs and completion info
  const activeWorkouts = instances.map((instance: any) => ({
    instanceId: instance.id,
    workoutId: instance.workoutId,
    completedExercises: (instance.completedExercises || []) as string[],
    startedAt: instance.startedAt,
  }));

  return {
    activeWorkouts,
    isLoading,
  };
}

/**
 * Start a workout for a user (create new daily instance or resume today's instance)
 */
export async function startUserWorkout(
  userId: string,
  workoutId: string
): Promise<string> {
  try {
    const todayDate = getTodayDateString();
    
    // Check if there's an instance for today
    const { data } = await db.queryOnce({
      userWorkouts: {
        $: {
          where: {
            userId: userId as any,
            workoutId: workoutId as any,
            workoutDate: todayDate as any,
          },
        },
      },
    });

    const instances = data?.userWorkouts || [];
    
    // Find existing in_progress instance
    const inProgressInstance = instances.find((inst: any) => inst.status === 'in_progress');
    
    if (inProgressInstance) {
      // Resume existing in-progress instance (ensure it's up to date)
      await db.transact([
        db.tx.userWorkouts[inProgressInstance.id].update({
          status: 'in_progress',
          startedAt: inProgressInstance.startedAt || Date.now(),
          updatedAt: Date.now(),
        }),
      ]);
      return inProgressInstance.id;
    }
    
    // If no in_progress instance, create a new one
    const instanceId = id();
    await db.transact([
      db.tx.userWorkouts[instanceId].update({
        userId,
        workoutId,
        status: 'in_progress',
        completedExercises: [],
        workoutDate: todayDate,
        startedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
      // Link the instance to the user
      db.tx.users[userId].link({ userWorkouts: instanceId }),
    ]);
    return instanceId;
  } catch (error) {
    console.error('Error starting user workout:', error);
    throw error;
  }
}

/**
 * Update exercise completion status for today's workout instance
 */
export async function updateExerciseCompletion(
  userId: string,
  workoutId: string,
  exerciseId: string,
  isCompleted: boolean
): Promise<void> {
  try {
    const todayDate = getTodayDateString();
    
    // Get today's workout instances
    const { data } = await db.queryOnce({
      userWorkouts: {
        $: {
          where: {
            userId: userId as any,
            workoutId: workoutId as any,
            workoutDate: todayDate as any,
          },
        },
      },
    });

    const instances = data?.userWorkouts || [];
    
    // Find the in_progress instance (only one should exist)
    const instance = instances.find((inst: any) => inst.status === 'in_progress');

    if (!instance) {
      throw new Error('No active workout instance found. Please start the workout first.');
    }

    const completedExercises = (instance.completedExercises || []) as string[];
    let updatedExercises: string[];

    if (isCompleted) {
      // Add exercise ID if not already present
      if (!completedExercises.includes(exerciseId)) {
        updatedExercises = [...completedExercises, exerciseId];
      } else {
        updatedExercises = completedExercises;
      }
    } else {
      // Remove exercise ID
      updatedExercises = completedExercises.filter((id) => id !== exerciseId);
    }

    await db.transact([
      db.tx.userWorkouts[instance.id].update({
        completedExercises: updatedExercises,
        updatedAt: Date.now(),
      }),
    ]);
  } catch (error) {
    console.error('Error updating exercise completion:', error);
    throw error;
  }
}

/**
 * Complete today's workout instance for a user
 */
export async function completeUserWorkout(
  userId: string,
  workoutId: string,
  totalExercises: number
): Promise<void> {
  try {
    const todayDate = getTodayDateString();
    
    // Get today's workout instances
    const { data } = await db.queryOnce({
      userWorkouts: {
        $: {
          where: {
            userId: userId as any,
            workoutId: workoutId as any,
            workoutDate: todayDate as any,
          },
        },
      },
    });

    const instances = data?.userWorkouts || [];
    
    // Find the in_progress instance (only one should exist)
    const instance = instances.find((inst: any) => inst.status === 'in_progress');

    if (!instance) {
      throw new Error('No active workout instance found. Please start the workout first.');
    }

    const completedExercises = (instance.completedExercises || []) as string[];

    // Check if all exercises are completed
    if (completedExercises.length !== totalExercises) {
      throw new Error('Please complete all exercises before finishing the workout.');
    }

    // Update instance to completed
    await db.transact([
      db.tx.userWorkouts[instance.id].update({
        status: 'completed',
        completedAt: Date.now(),
        updatedAt: Date.now(),
      }),
    ]);
  } catch (error) {
    console.error('Error completing user workout:', error);
    throw error;
  }
}

