import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Exercise } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ExerciseVideo } from './ExerciseVideo';

interface ExercisesListProps {
  exercises: Exercise[];
  completedExercises: Set<string>;
  onToggleExercise: (exerciseId: string) => void;
  workoutId?: string;
}

export function ExercisesList({
  exercises,
  completedExercises,
  onToggleExercise,
  workoutId,
}: ExercisesListProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.exercisesSection}>
      <Text style={styles.sectionTitle}>Exercises</Text>
      {exercises.map((exercise, index) => {
        const isCompleted = completedExercises.has(exercise.id);
        return (
          <ExerciseVideo
            key={exercise.id}
            exercise={{ ...exercise, workoutId } as any}
            index={index}
            isCompleted={isCompleted}
            onToggle={onToggleExercise}
          />
        );
      })}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  exercisesSection: {
    marginBottom: 100,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
});

