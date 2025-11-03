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

