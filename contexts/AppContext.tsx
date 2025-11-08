import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { UserProfile, WorkoutLog, AchievementPreferences, SocialPost } from '@/types';
import { db } from '@/lib/instant';
import { useAuth } from '@/lib/useAuth';
import { useUserProfile, useUserWorkoutLogs, useUserAchievements, logWorkoutToDB, updateCustomMetric as updateCustomMetricDB, updateUserProfile } from '@/lib/useUserData';

const DEFAULT_PROFILE: UserProfile = {
  id: 'user1',
  name: 'Fitness Warrior',
  email: 'warrior@gharogym.com',
  goals: [
    {
      id: 'g1',
      type: 'workouts',
      target: 20,
      current: 12,
      unit: 'workouts',
      startDate: new Date().toISOString(),
    },
    {
      id: 'g2',
      type: 'streak',
      target: 30,
      current: 12,
      unit: 'days',
      startDate: new Date().toISOString(),
    },
  ],
  workoutStreak: 12,
  totalWorkouts: 47,
  points: 1420,
  achievements: [
    {
      id: 'a1',
      title: 'First Workout',
      description: 'Completed your first workout',
      icon: '🎯',
      unlockedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'a2',
      title: 'Week Warrior',
      description: '7 day streak achieved',
      icon: '🔥',
      unlockedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  customMetrics: {
    energyLevel: 7,
    sleepQuality: 8,
    lastWorkoutDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
};

const DEFAULT_PREFERENCES: AchievementPreferences = {
  autoPost: true,
  shareWorkouts: true,
  shareMilestones: true,
  shareChallenges: true,
};

export const [AppProvider, useApp] = createContextHook(() => {
  const { isAuthenticated } = useAuth();
  const { user: authUser } = db.useAuth();
  const { profile: dbProfile, userId: dbUserId, isLoading: profileLoading } = useUserProfile();
  const { logs: dbLogs, isLoading: logsLoading } = useUserWorkoutLogs();
  const { achievements: dbAchievements, isLoading: achievementsLoading } = useUserAchievements();
  
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [preferences, setPreferences] = useState<AchievementPreferences>(DEFAULT_PREFERENCES);
  const [socialFeed, setSocialFeed] = useState<SocialPost[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Load local data only once on mount (for non-authenticated users)
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        try {
          const [storedProfile, storedLogs, storedPreferences, storedFeed] = await Promise.all([
            AsyncStorage.getItem('profile'),
            AsyncStorage.getItem('workoutLogs'),
            AsyncStorage.getItem('preferences'),
            AsyncStorage.getItem('socialFeed'),
          ]);

          if (storedProfile) {
            setLocalProfile(JSON.parse(storedProfile));
          }
          if (storedLogs) {
            setWorkoutLogs(JSON.parse(storedLogs));
          }
          if (storedPreferences) {
            setPreferences(JSON.parse(storedPreferences));
          }
          if (storedFeed) {
            setSocialFeed(JSON.parse(storedFeed));
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setIsLoadingLocal(false);
        }
      } else {
        setIsLoadingLocal(false);
      }
    };

    loadData();
  }, [isAuthenticated]);


  const profile: UserProfile = isAuthenticated && dbProfile
    ? {
        ...dbProfile,
        achievements: dbAchievements || [],
      }
    : localProfile || DEFAULT_PROFILE;

  // Use database logs if authenticated, otherwise use local logs
  const finalWorkoutLogs: WorkoutLog[] = isAuthenticated ? (dbLogs || []) : workoutLogs;

  const isLoading = isAuthenticated
    ? profileLoading || logsLoading || achievementsLoading
    : isLoadingLocal;

  const saveProfile = async (newProfile: UserProfile) => {
    try {
      if (isAuthenticated) {
        // For authenticated users, profile is managed by InstantDB
        // This is just for backward compatibility
        return;
      }
      await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
      setLocalProfile(newProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const updateCustomMetric = async (
    metric: 'energyLevel' | 'sleepQuality',
    value: number
  ) => {
    if (isAuthenticated && dbUserId) {
      await updateCustomMetricDB(dbUserId, metric, value);
      return;
    }
    const updatedProfile = {
      ...profile,
      customMetrics: {
        ...profile.customMetrics,
        [metric]: value,
      },
    };
    await saveProfile(updatedProfile);
  };

  const updateWeight = async (
    current: number,
    target: number,
    unit: 'kg' | 'lbs'
  ) => {
    if (isAuthenticated && dbUserId) {
      // Update weight in customMetrics
      const customMetrics = profile.customMetrics || {};
      await updateUserProfile(dbUserId, {
        customMetrics: {
          ...customMetrics,
          weight: { current, target, unit },
        },
      });
      return;
    }
    const updatedProfile = {
      ...profile,
      weight: { current, target, unit },
    };
    await saveProfile(updatedProfile);
  };

  const updateProfile = async (updates: {
    name?: string;
    email?: string;
    avatar?: string;
  }) => {
    if (isAuthenticated && dbUserId) {
      // Update profile in database
      await updateUserProfile(dbUserId, updates);
      return;
    }
    // For non-authenticated users, update local profile
    const updatedProfile = {
      ...profile,
      ...updates,
    };
    await saveProfile(updatedProfile);
  };

  const addSocialPost = async (post: Omit<SocialPost, 'id' | 'timestamp'>) => {
    try {
      const newPost: SocialPost = {
        ...post,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updatedFeed = [newPost, ...socialFeed];
      await AsyncStorage.setItem('socialFeed', JSON.stringify(updatedFeed));
      setSocialFeed(updatedFeed);
    } catch (error) {
      console.error('Error adding social post:', error);
    }
  };

  const updatePreferences = async (newPreferences: AchievementPreferences) => {
    try {
      await AsyncStorage.setItem('preferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const logWorkout = async (log: Omit<WorkoutLog, 'id'>) => {
    if (!isAuthenticated || !authUser) {
      throw new Error('You must be logged in to complete workouts. Please sign in to track your progress.');
    }

    if (!dbUserId) {
      throw new Error('User profile not found. Please try logging out and back in.');
    }

    try {
      // Log workout to InstantDB
      // This will automatically update the profile stats (totalWorkouts, streak, points, etc.)
      // Workout logs are tracked separately in workoutLogs table
      // Stats (totalWorkouts, streak, points) are maintained in userProfiles table for performance
      console.log('Logging workout for user:', dbUserId);
      await logWorkoutToDB(dbUserId, log);
      
      // Profile updates automatically via reactive database hooks (useUserProfile)
      // Just handle social post if needed
      if (preferences.autoPost && preferences.shareWorkouts && dbProfile) {
        await addSocialPost({
          userId: dbProfile.id,
          userName: dbProfile.name,
          userAvatar: dbProfile.avatar,
          type: 'workout',
          content: `Just completed a workout! 💪`,
          likes: 0,
          comments: 0,
          data: {
            workoutId: log.workoutId,
          },
        });
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      throw error;
    }
  };

  const getSuggestionEngine = () => {
    const lastWorkoutDate = profile.customMetrics.lastWorkoutDate;
    if (!lastWorkoutDate) {
      return 'Start your fitness journey today! 💪';
    }

    const daysSinceLastWorkout = Math.floor(
      (Date.now() - new Date(lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastWorkout >= 3) {
      return '⚠️ You missed 3+ days! Quick 15-min workout to get back on track?';
    }

    if (daysSinceLastWorkout === 0 && profile.workoutStreak >= 7) {
      return '🔥 Amazing streak! Keep the momentum going!';
    }

    const workoutGoal = profile.goals.find((g) => g.type === 'workouts');
    if (workoutGoal && workoutGoal.current / workoutGoal.target >= 0.75) {
      return '🎯 You\'re 75% to your goal! Push harder!';
    }

    if (profile.customMetrics.energyLevel <= 4) {
      return '😴 Low energy? Try a gentle yoga session or short walk.';
    }

    if (profile.customMetrics.sleepQuality <= 5) {
      return '💤 Poor sleep detected. Light stretching might help tonight.';
    }

    return '💪 Ready to crush your workout today?';
  };

  return {
    profile,
    workoutLogs: finalWorkoutLogs,
    preferences,
    socialFeed,
    isLoading,
    isAuthenticated,
    saveProfile,
    updateProfile,
    updateCustomMetric,
    updateWeight,
    logWorkout,
    suggestionEngine: getSuggestionEngine(),
    addSocialPost,
    updatePreferences,
  };
});
