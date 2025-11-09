import { id } from '@instantdb/react-native';
import { db } from './instant';
import { CHALLENGES } from '@/mocks/challenges';

/**
 * Seeds the InstantDB database with example challenge data.
 * Call this function ONCE to populate your database.
 * 
 * Usage:
 * import { seedChallenges } from '@/lib/seed-challenges';
 * await seedChallenges();
 */
export async function seedChallenges() {
  try {
    console.log('🌱 Starting to seed challenge data...');
    
    const transactions = [];
    
    // Create transactions for each challenge
    for (const challenge of CHALLENGES) {
      // Generate a new UUID for the challenge
      const challengeId = id();
      
      // Check if endDate is in the past to determine if challenge is active
      const endDate = new Date(challenge.endDate);
      const now = new Date();
      const isActive = endDate >= now;
      
      // Create the challenge transaction
      transactions.push(
        db.tx.challenges[challengeId].update({
          title: challenge.title,
          culturalName: challenge.culturalName,
          description: challenge.description,
          type: challenge.type,
          goal: challenge.goal,
          endDate: challenge.endDate,
          reward: challenge.reward,
          isActive,
          metricType: challenge.metricType || 'workout_count',
          category: challenge.category,
          // current date string
          createdAt: new Date().toISOString(),
        })
      );
    }
    
    // Execute all transactions at once
    await db.transact(transactions);
    
    console.log(`✅ Successfully seeded ${CHALLENGES.length} challenges!`);
    return { success: true, count: CHALLENGES.length };
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    throw error;
  }
}

/**
 * Clears all challenge and user challenge progress data from the database.
 * Use this if you need to reset and re-seed.
 */
export async function clearChallenges() {
  try {
    console.log('🗑️  Clearing challenge data...');
    
    // Query all challenges and user challenge progress
    const { data } = await db.queryOnce({
      challenges: {},
      userChallengeProgress: {},
    });
    
    const transactions = [];
    
    // Delete all user challenge progress first (to avoid foreign key issues)
    if (data.userChallengeProgress) {
      for (const progress of data.userChallengeProgress) {
        transactions.push(db.tx.userChallengeProgress[progress.id].delete());
      }
    }
    
    // Delete all challenges
    if (data.challenges) {
      for (const challenge of data.challenges) {
        transactions.push(db.tx.challenges[challenge.id].delete());
      }
    }
    
    // Execute all deletions
    if (transactions.length > 0) {
      await db.transact(transactions);
    }
    
    console.log('✅ Successfully cleared all challenge data!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing challenges:', error);
    throw error;
  }
}

