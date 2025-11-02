import { db } from './instant';

/**
 * Custom hook to fetch all workouts with their exercises from InstantDB
 * 
 * @returns {Object} - { isLoading, error, data }
 * - isLoading: boolean indicating if data is loading
 * - error: any error that occurred
 * - data: { workouts: Workout[] } where each workout includes its exercises
 */
export function useWorkouts() {
  return db.useQuery({
    workouts: {
      exercises: {},
    },
  });
}

/**
 * Custom hook to fetch a single workout by ID with its exercises
 * 
 * @param workoutId - The ID of the workout to fetch
 * @returns {Object} - { isLoading, error, data }
 */
export function useWorkout(workoutId: string) {
  const result = db.useQuery({
    workouts: {
      $: {
        where: {
          id: workoutId,
        },
      },
      exercises: {},
    },
  });

  return {
    ...result,
    data: result.data ? {
      workout: result.data.workouts?.[0] || null,
    } : null,
  };
}

/**
 * Custom hook to fetch workouts by category
 * 
 * @param category - The category to filter by ('strength', 'cardio', 'flexibility', 'cultural')
 * @returns {Object} - { isLoading, error, data }
 */
export function useWorkoutsByCategory(category: string) {
  return db.useQuery({
    workouts: {
      $: {
        where: {
          category: category,
        },
      },
      exercises: {},
    },
  });
}

/**
 * Custom hook to fetch workouts by difficulty
 * 
 * @param difficulty - The difficulty to filter by ('beginner', 'intermediate', 'advanced')
 * @returns {Object} - { isLoading, error, data }
 */
export function useWorkoutsByDifficulty(difficulty: string) {
  return db.useQuery({
    workouts: {
      $: {
        where: {
          difficulty: difficulty,
        },
      },
      exercises: {},
    },
  });
}

