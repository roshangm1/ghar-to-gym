import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { UserProfile, WorkoutLog, AchievementPreferences, SocialPost } from '@/types';

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
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [preferences, setPreferences] = useState<AchievementPreferences>(DEFAULT_PREFERENCES);
  const [socialFeed, setSocialFeed] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedProfile, storedLogs, storedPreferences, storedFeed] = await Promise.all([
        AsyncStorage.getItem('profile'),
        AsyncStorage.getItem('workoutLogs'),
        AsyncStorage.getItem('preferences'),
        AsyncStorage.getItem('socialFeed'),
      ]);

      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
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
      setIsLoading(false);
    }
  };

  const saveProfile = async (newProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const updateCustomMetric = async (
    metric: 'energyLevel' | 'sleepQuality',
    value: number
  ) => {
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
    const updatedProfile = {
      ...profile,
      weight: { current, target, unit },
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
    try {
      const newLog: WorkoutLog = {
        ...log,
        id: Date.now().toString(),
      };

      const updatedLogs = [...workoutLogs, newLog];
      await AsyncStorage.setItem('workoutLogs', JSON.stringify(updatedLogs));
      setWorkoutLogs(updatedLogs);

      const today = new Date().toISOString().split('T')[0];
      const lastWorkout = profile.customMetrics.lastWorkoutDate?.split('T')[0];
      const isNewDay = today !== lastWorkout;

      if (isNewDay) {
        const newStreak =
          lastWorkout &&
          new Date(today).getTime() - new Date(lastWorkout).getTime() ===
            24 * 60 * 60 * 1000
            ? profile.workoutStreak + 1
            : 1;

        const updatedProfile: UserProfile = {
          ...profile,
          totalWorkouts: profile.totalWorkouts + 1,
          workoutStreak: newStreak,
          points: profile.points + 50,
          customMetrics: {
            ...profile.customMetrics,
            lastWorkoutDate: new Date().toISOString(),
          },
        };

        await saveProfile(updatedProfile);

        if (preferences.autoPost && preferences.shareWorkouts) {
          await addSocialPost({
            userId: profile.id,
            userName: profile.name,
            userAvatar: profile.avatar,
            type: 'workout',
            content: `Just completed a workout! 💪`,
            likes: 0,
            comments: 0,
            data: {
              workoutId: log.workoutId,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error logging workout:', error);
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
    workoutLogs,
    preferences,
    socialFeed,
    isLoading,
    saveProfile,
    updateCustomMetric,
    updateWeight,
    logWorkout,
    suggestionEngine: getSuggestionEngine(),
    addSocialPost,
    updatePreferences,
  };
});
