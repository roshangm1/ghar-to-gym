import { useLocalSearchParams, router } from 'expo-router';
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
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
  
  // Memoize completedExercises Set to prevent unnecessary re-renders
  const completedExercises = useMemo(
    () => new Set(dbCompletedExercises),
    [dbCompletedExercises]
  );

  // Memoize derived values
  const isWorkoutStarted = status === 'in_progress'

  console.log('status', status);
  
  const isWorkoutCompleted = useMemo(
    () => status === 'completed',
    [status]
  );

  // Memoize styles to prevent recreation
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Memoize allExercisesCompleted before early returns
  const allExercisesCompleted = useMemo(() => {
    if (!workout) return false;
    return workout.exercises.every((ex) => completedExercises.has(ex.id));
  }, [workout, completedExercises]);

  const handleStartWorkout = useCallback(async () => {
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
  }, [isAuthenticated, userId, id]);

  const toggleExercise = useCallback(async (exerciseId: string) => {
    if (!workout) return;
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
  }, [workout, isAuthenticated, userId, isWorkoutStarted, completedExercises, id]);

  const handleCompleteWorkout = useCallback(async () => {
    if (!workout) return;
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
  }, [isAuthenticated, userId, isWorkoutStarted, allExercisesCompleted, workout, logWorkout]);

  if (isLoading || instanceLoading) {
    return <LoadingState />;
  }

  if (error || !workout) {
    return <ErrorState error={error instanceof Error ? error : null} />;
  }

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
        <View style={styles.exercisesContainer}>
          <View 
            style={[styles.exercisesContent, !isWorkoutStarted && styles.exercisesContentBlurred]}
            pointerEvents={!isWorkoutStarted ? 'none' : 'auto'}
          >
            <ExercisesList
              exercises={workout.exercises}
              completedExercises={completedExercises}
              onToggleExercise={toggleExercise}
              workoutId={workout.id}
              isWorkoutStarted={isWorkoutStarted}
            />
          </View>
          {!isWorkoutStarted && (
            <View style={styles.blurOverlay}>
              <BlurView
                intensity={10}
                style={StyleSheet.absoluteFill}
                tint="dark"
              />
            </View>
          )}
        </View>
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
  exercisesContainer: {
    position: 'relative',
  },
  exercisesContent: {
    opacity: 1,
  },
  exercisesContentBlurred: {
    opacity: 0.6,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
