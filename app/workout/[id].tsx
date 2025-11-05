import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useWorkout } from '@/lib/useWorkouts';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Workout } from '@/types';
import { useUserProfile, useUserWorkoutInstance, startUserWorkout, updateExerciseCompletion, completeUserWorkout } from '@/lib/useUserData';
import {
  LoadingState,
  ErrorState,
  WorkoutHeader,
  WorkoutDescription,
  ExerciseMeta,
  EquipmentSection,
  StartWorkoutSection,
  ExercisesList,
  WorkoutFooter,
} from '@/components/workout';


export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { logWorkout, isAuthenticated } = useApp();
  const colors = useThemeColor();
  const { userId } = useUserProfile();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch workout from InstantDB
  const { isLoading, error, data } = useWorkout(id as string);
  const workout = data?.workout;
  
  // Fetch user workout instance
  const { status, completedExercises: dbCompletedExercises, isLoading: instanceLoading } = useUserWorkoutInstance(
    userId,
    id as string
  );
  
  const completedExercises = new Set(dbCompletedExercises);
  const isWorkoutStarted = status === 'in_progress' || status === 'completed';
  const isWorkoutCompleted = status === 'completed';
  const styles = createStyles(colors);

  if (isLoading || instanceLoading) {
    return <LoadingState />;
  }

  if (error || !workout) {
    return <ErrorState error={error instanceof Error ? error : null} />;
  }

  const allExercisesCompleted = workout.exercises.every((ex) =>
    completedExercises.has(ex.id)
  );

  const handleStartWorkout = async () => {
    if (!isAuthenticated || !userId) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to start workouts and track your progress.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Login',
            onPress: () => router.push('/auth'),
          },
        ]
      );
      return;
    }

    setIsUpdating(true);
    try {
      await startUserWorkout(userId, id as string);
      setIsUpdating(false);
    } catch (error: any) {
      setIsUpdating(false);
      Alert.alert(
        'Error',
        error.message || 'Failed to start workout. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleExercise = async (exerciseId: string) => {
    if (!isAuthenticated || !userId) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to track exercise completion.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Login',
            onPress: () => router.push('/auth'),
          },
        ]
      );
      return;
    }

    if (!isWorkoutStarted) {
      Alert.alert(
        'Start Workout First',
        'Please start the workout before marking exercises as complete.',
        [{ text: 'OK' }]
      );
      return;
    }

    const isCompleted = completedExercises.has(exerciseId);
    
    setIsUpdating(true);
    try {
      await updateExerciseCompletion(userId, id as string, exerciseId, !isCompleted);
      setIsUpdating(false);
    } catch (error: any) {
      setIsUpdating(false);
      Alert.alert(
        'Error',
        error.message || 'Failed to update exercise. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCompleteWorkout = async () => {
    if (!isAuthenticated || !userId) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to complete workouts and track your progress.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Login',
            onPress: () => router.push('/auth'),
          },
        ]
      );
      return;
    }

    if (!isWorkoutStarted) {
      Alert.alert(
        'Start Workout First',
        'Please start the workout before completing it.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!allExercisesCompleted) {
      Alert.alert(
        'Incomplete Workout',
        'Complete all exercises before finishing the workout.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsUpdating(true);
    try {
      // Mark the user workout instance as completed
      await completeUserWorkout(userId, workout.id, workout.exercises.length);
      
      // Log the workout (this updates user stats)
      await logWorkout({
        workoutId: workout.id,
        date: new Date().toISOString(),
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurn,
        energyBefore: 7,
        energyAfter: 8,
      });

      setIsUpdating(false);
      Alert.alert(
        'Workout Complete! 🎉',
        `Great job! You earned 50 points and burned ${workout.caloriesBurn} calories!`,
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      setIsUpdating(false);
      Alert.alert(
        'Error',
        error.message || 'Failed to complete workout. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <WorkoutHeader workout={workout as Workout} />
        <WorkoutDescription description={workout.description} />
        <ExerciseMeta
          duration={workout.duration}
          caloriesBurn={workout.caloriesBurn}
          totalExercises={workout.exercises.length}
        />
        <EquipmentSection equipment={workout.equipment} />
        {isWorkoutStarted ? (
          <ExercisesList
            exercises={workout.exercises}
            completedExercises={completedExercises}
            onToggleExercise={toggleExercise}
            workoutId={workout.id}
          />
        ) : (
          <StartWorkoutSection isWorkoutCompleted={isWorkoutCompleted} />
        )}
      </ScrollView>
      <WorkoutFooter
        isWorkoutCompleted={isWorkoutCompleted}
        isWorkoutStarted={isWorkoutStarted}
        isUpdating={isUpdating}
        allExercisesCompleted={allExercisesCompleted}
        onStartWorkout={handleStartWorkout}
        onCompleteWorkout={handleCompleteWorkout}
      />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
});
