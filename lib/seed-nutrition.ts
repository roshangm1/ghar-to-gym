import { id } from '@instantdb/react-native';
import { db } from './instant';
import { NUTRITION_TIPS } from '@/mocks/nutrition';

/**
 * Seeds the InstantDB database with example nutrition data.
 * Call this function ONCE to populate your database.
 * 
 * Usage:
 * import { seedNutrition } from '@/lib/seed-nutrition';
 * await seedNutrition();
 */
export async function seedNutrition() {
  try {
    console.log('🌱 Starting to seed nutrition data...');
    
    const transactions = [];
    
    // Create transactions for each nutrition tip
    for (const tip of NUTRITION_TIPS) {
      // Generate a new UUID for the nutrition tip
      const tipId = id();
      
      // Create the nutrition tip transaction
      transactions.push(
        db.tx.nutritionTips[tipId].update({
          title: tip.title,
          category: tip.category,
          description: tip.description,
          imageUrl: tip.imageUrl,
          tips: tip.tips,
          calories: tip.nutritionInfo?.calories,
          protein: tip.nutritionInfo?.protein,
          carbs: tip.nutritionInfo?.carbs,
          fat: tip.nutritionInfo?.fat,
          createdAt: Date.now(),
        })
      );
    }
    
    // Execute all transactions at once
    await db.transact(transactions);
    
    console.log(`✅ Successfully seeded ${NUTRITION_TIPS.length} nutrition tips!`);
    return { success: true, count: NUTRITION_TIPS.length };
  } catch (error) {
    console.error('❌ Error seeding nutrition:', error);
    throw error;
  }
}

/**
 * Clears all nutrition tip data from the database.
 * Use this if you need to reset and re-seed.
 */
export async function clearNutrition() {
  try {
    console.log('🗑️  Clearing nutrition data...');
    
    // Query all nutrition tips
    const { data } = await db.queryOnce({
      nutritionTips: {},
    });
    
    const transactions = [];
    
    // Delete all nutrition tips
    if (data.nutritionTips) {
      for (const tip of data.nutritionTips) {
        transactions.push(db.tx.nutritionTips[tip.id].delete());
      }
    }
    
    if (transactions.length > 0) {
      await db.transact(transactions);
    }
    
    console.log('✅ Successfully cleared all nutrition data!');
    return { success: true, deleted: transactions.length };
  } catch (error) {
    console.error('❌ Error clearing nutrition:', error);
    throw error;
  }
}

