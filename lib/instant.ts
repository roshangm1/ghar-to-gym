import { init, i } from '@instantdb/react-native';

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
  },
});

// Initialize InstantDB
export const db = init({ 
  appId: APP_ID, 
  schema,
});

export type Schema = typeof schema;

