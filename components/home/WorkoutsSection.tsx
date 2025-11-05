import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Workout, WorkoutCategory } from '@/types';
import { CATEGORIES } from './CategoryFilters';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { WorkoutsGrid } from './WorkoutsGrid';

interface WorkoutsSectionProps {
  isLoading: boolean;
  error: Error | null;
  workouts: Workout[];
  filteredWorkouts: Workout[];
  selectedCategory: WorkoutCategory | 'all';
  onWorkoutPress: (workoutId: string) => void;
}

export function WorkoutsSection({
  isLoading,
  error,
  workouts,
  filteredWorkouts,
  selectedCategory,
  onWorkoutPress,
}: WorkoutsSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  const sectionTitle = selectedCategory === 'all' 
    ? 'All Workouts' 
    : CATEGORIES.find((c) => c.id === selectedCategory)?.label;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : filteredWorkouts.length === 0 ? (
        <EmptyState hasWorkouts={workouts.length > 0} />
      ) : (
        <WorkoutsGrid workouts={filteredWorkouts} onWorkoutPress={onWorkoutPress} />
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});

