import { init, i, id } from '@instantdb/react-native';

// Get your APP_ID from https://instantdb.com/dash
// Replace this with your actual InstantDB APP_ID
const APP_ID = 'f69eae61-f5b0-4a15-b7ba-dffea0fa17fa'; // TODO: Replace with your actual APP_ID

// Define the schema for InstantDB
const schema = i.schema({
  entities: {
    workouts: i.entity({
      title: i.string(),
      culturalName: i.string(),
      description: i.string(),
      duration: i.number(),
      difficulty: i.string(),
      equipment: i.json(), // Array of strings
      category: i.string(),
      caloriesBurn: i.number(),
      imageUrl: i.string(),
      createdAt: i.number(),
    }),
    exercises: i.entity({
      workoutId: i.string(),
      name: i.string(),
      reps: i.string().optional(),
      duration: i.number().optional(),
      instructions: i.json(), // Array of strings
      videoUrl: i.string().optional(),
      imageUrl: i.string().optional(),
      order: i.number(),
    }),
    nutritionTips: i.entity({
      title: i.string(),
      category: i.string(), // 'dal-bhat' | 'momo' | 'traditional' | 'modern'
      description: i.string(),
      imageUrl: i.string(),
      tips: i.json(), // Array of strings
      calories: i.number().optional(),
      protein: i.number().optional(),
      carbs: i.number().optional(),
      fat: i.number().optional(),
      createdAt: i.number(),
    }),
    // Note: $users is automatically created by InstantDB for auth
    // It contains basic info: email (main identifier), id
    // We need to reference it in the schema to use it in links
    $users: i.entity({
      email: i.string(),
    }),
    // Custom users table - contains all user information and stats
    // Linked to $users via userId (which is the $users.id)
    users: i.entity({
      userId: i.string(), // Reference to $users.id
      email: i.string(), // Duplicated from $users for easier queries
      name: i.string(),
      avatar: i.string().optional(),
      // Stats - simple numbers
      workoutStreak: i.number(),
      totalWorkouts: i.number(),
      points: i.number(),
      // Additional data
      customMetrics: i.json(), // { energyLevel, sleepQuality, lastWorkoutDate, weight }
      goals: i.json(), // Array of UserGoal
      preferences: i.json().optional(), // AchievementPreferences
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    authCodes: i.entity({
      email: i.string(),
      code: i.string(),
      expiresAt: i.number(),
      used: i.boolean(),
      createdAt: i.number(),
    }),
    workoutLogs: i.entity({
      userId: i.string(),
      workoutId: i.string(),
      date: i.string(), // ISO date string
      duration: i.number(),
      caloriesBurned: i.number(),
      energyBefore: i.number(),
      energyAfter: i.number(),
      notes: i.string().optional(),
      createdAt: i.number(),
    }),
    achievements: i.entity({
      userId: i.string(),
      achievementId: i.string(), // e.g., 'first_workout', 'week_warrior'
      title: i.string(),
      description: i.string(),
      icon: i.string(),
      unlockedDate: i.string(), // ISO date string
      createdAt: i.number(),
    }),
    socialPosts: i.entity({
      userId: i.string(),
      userName: i.string(),
      userAvatar: i.string().optional(),
      type: i.string(), // 'achievement' | 'workout' | 'milestone' | 'challenge'
      content: i.string(),
      likes: i.number(),
      comments: i.number(),
      data: i.json().optional(), // Additional post data
      createdAt: i.number(),
    }),
  },
  links: {
    workoutExercises: {
      forward: {
        on: 'workouts',
        has: 'many',
        label: 'exercises',
      },
      reverse: {
        on: 'exercises',
        has: 'one',
        label: 'workout',
      },
    },
    // Note: $users is read-only, so we can't create links FROM it
    // We store the reference in users.userId field pointing to $users.id
    // For querying, we query users table and use the userId field
    // Link users to workoutLogs
    userWorkoutLogs: {
      forward: {
        on: 'users',
        has: 'many',
        label: 'workoutLogs',
      },
      reverse: {
        on: 'workoutLogs',
        has: 'one',
        label: 'user',
      },
    },
    // Link users to achievements
    userAchievements: {
      forward: {
        on: 'users',
        has: 'many',
        label: 'achievements',
      },
      reverse: {
        on: 'achievements',
        has: 'one',
        label: 'user',
      },
    },
    // Link users to socialPosts
    userSocialPosts: {
      forward: {
        on: 'users',
        has: 'many',
        label: 'socialPosts',
      },
      reverse: {
        on: 'socialPosts',
        has: 'one',
        label: 'user',
      },
    },
  },
});

// Initialize InstantDB
export const db = init({ 
  appId: APP_ID, 
  schema,
});

export { id };

export type Schema = typeof schema;

