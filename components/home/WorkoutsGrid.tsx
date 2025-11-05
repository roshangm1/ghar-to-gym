import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Workout } from '@/types';
import { WorkoutCard } from './WorkoutCard';

interface WorkoutsGridProps {
  workouts: Workout[];
  onWorkoutPress: (workoutId: string) => void;
}

export function WorkoutsGrid({ workouts, onWorkoutPress }: WorkoutsGridProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.workoutsGrid}>
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onPress={() => onWorkoutPress(workout.id)}
        />
      ))}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  workoutsGrid: {
    paddingHorizontal: 12,
    gap: 16,
  },
});

