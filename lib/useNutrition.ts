import { db } from './instant';

/**
 * Custom hook to fetch all nutrition tips from InstantDB
 * 
 * @returns {Object} - { isLoading, error, data }
 * - isLoading: boolean indicating if data is loading
 * - error: any error that occurred
 * - data: { nutritionTips: NutritionTip[] }
 */
export function useNutrition() {
  return db.useQuery({
    nutritionTips: {},
  });
}

/**
 * Custom hook to fetch a single nutrition tip by ID
 * 
 * @param tipId - The ID of the nutrition tip to fetch
 * @returns {Object} - { isLoading, error, data }
 */
export function useNutritionTip(tipId: string) {
  const result = db.useQuery({
    nutritionTips: {
      $: {
        where: {
          id: tipId,
        },
      },
    },
  });

  return {
    ...result,
    data: result.data ? {
      tip: result.data.nutritionTips?.[0] || null,
    } : null,
  };
}

/**
 * Custom hook to fetch nutrition tips by category
 * 
 * @param category - The category to filter by ('dal-bhat', 'momo', 'traditional', 'modern')
 * @returns {Object} - { isLoading, error, data }
 */
export function useNutritionByCategory(category: string) {
  return db.useQuery({
    nutritionTips: {
      $: {
        where: {
          category: category,
        },
      },
    },
  });
}

