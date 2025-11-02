import { id } from '@instantdb/react-native';
import { db } from './instant';
import { WORKOUTS } from '@/mocks/workouts';

/**
 * Seeds the InstantDB database with example workout data.
 * Call this function ONCE to populate your database.
 * 
 * Usage:
 * import { seedWorkouts } from '@/lib/seed-workouts';
 * await seedWorkouts();
 */
export async function seedWorkouts() {
  try {
    console.log('🌱 Starting to seed workout data...');
    
    const transactions = [];
    
    // Create transactions for each workout and its exercises
    for (const workout of WORKOUTS) {
      // Generate a new UUID for the workout
      const workoutId = id();
      
      // Create the workout transaction
      transactions.push(
        db.tx.workouts[workoutId].update({
          title: workout.title,
          culturalName: workout.culturalName,
          description: workout.description,
          duration: workout.duration,
          difficulty: workout.difficulty,
          equipment: workout.equipment,
          category: workout.category,
          caloriesBurn: workout.caloriesBurn,
          imageUrl: workout.imageUrl,
          createdAt: Date.now(),
        })
      );
      
      // Create exercise transactions
      for (let i = 0; i < workout.exercises.length; i++) {
        const exercise = workout.exercises[i];
        // Generate a new UUID for the exercise
        const exerciseId = id();
        
        transactions.push(
          db.tx.exercises[exerciseId].update({
            workoutId: workoutId,
            name: exercise.name,
            reps: exercise.reps,
            duration: exercise.duration,
            instructions: exercise.instructions,
            videoUrl: exercise.videoUrl,
            imageUrl: exercise.imageUrl,
            order: i,
          })
        );
        
        // Link the exercise to the workout
        transactions.push(
          db.tx.workouts[workoutId].link({
            exercises: exerciseId,
          })
        );
      }
    }
    
    // Execute all transactions at once
    await db.transact(transactions);
    
    console.log(`✅ Successfully seeded ${WORKOUTS.length} workouts with their exercises!`);
    return { success: true, count: WORKOUTS.length };
  } catch (error) {
    console.error('❌ Error seeding workouts:', error);
    throw error;
  }
}

/**
 * Clears all workout and exercise data from the database.
 * Use this if you need to reset and re-seed.
 */
export async function clearWorkouts() {
  try {
    console.log('🗑️  Clearing workout data...');
    
    // Query all workouts and exercises
    const { data } = await db.queryOnce({
      workouts: {},
      exercises: {},
    });
    
    const transactions = [];
    
    // Delete all workouts
    if (data.workouts) {
      for (const workout of data.workouts) {
        transactions.push(db.tx.workouts[workout.id].delete());
      }
    }
    
    // Delete all exercises
    if (data.exercises) {
      for (const exercise of data.exercises) {
        transactions.push(db.tx.exercises[exercise.id].delete());
      }
    }
    
    if (transactions.length > 0) {
      await db.transact(transactions);
    }
    
    console.log('✅ Successfully cleared all workout data!');
    return { success: true, deleted: transactions.length };
  } catch (error) {
    console.error('❌ Error clearing workouts:', error);
    throw error;
  }
}

