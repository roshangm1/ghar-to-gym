import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Exercise } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ExerciseVideo } from './ExerciseVideo';
import { LegendList } from '@legendapp/list';

interface ExercisesListProps {
  exercises: Exercise[];
  completedExercises: Set<string>;
  onToggleExercise: (exerciseId: string) => void;
  workoutId?: string;
  isWorkoutStarted?: boolean;
}

export function ExercisesList({
  exercises,
  completedExercises,
  onToggleExercise,
  workoutId,
  isWorkoutStarted,
}: ExercisesListProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);


  return (
    <View style={styles.exercisesSection}>
      <Text style={styles.sectionTitle}>Exercises</Text>
      <LegendList
        data={exercises}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        extraData={`${completedExercises.size}-${isWorkoutStarted}`}
        renderItem={({ item, index }) => {
          const isCompleted = completedExercises.has(item.id);
          return (
            <ExerciseVideo
              exercise={{ ...item, workoutId } as any}
              index={index}
              isCompleted={isCompleted}
              onToggle={onToggleExercise}
            />
          );
        }}
      />
    </View>

  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  exercisesSection: {
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
});

