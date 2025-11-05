import { router } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { useWorkouts } from '@/lib/useWorkouts';
import { WorkoutCategory, Workout } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useUserProfile, useActiveWorkouts } from '@/lib/useUserData';
import { useStatusBarBlur } from '@/components/StatusBarBlur';
import {
  HomeHeader,
  SuggestionCard,
  ActiveWorkoutSection,
  GoalsCard,
  StatsRow,
  CategoryFilters,
  WorkoutsSection,
} from '@/components/home';

export default function HomeScreen() {
  const { profile, suggestionEngine } = useApp();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | 'all'>('all');
  const styles = createStyles(colors);
  const { userId } = useUserProfile();
  const { handleScroll, StatusBarBlurComponent } = useStatusBarBlur();
  
  // Fetch workouts from InstantDB
  const { isLoading, error: errorData, data } = useWorkouts();
  const workouts = useMemo(() => (data?.workouts || []) as Workout[], [data?.workouts]);
  const error = errorData ? (errorData as Error) : null;
  
  // Fetch active workouts
  const { activeWorkouts } = useActiveWorkouts(userId);
  
  // Match active workouts with workout details
  const activeWorkoutsWithDetails = useMemo(() => {
    return activeWorkouts
      .map((active) => {
        const workout = workouts.find((w) => w.id === active.workoutId);
        if (!workout) return null;
        return {
          ...active,
          workout,
          progress: workout.exercises.length > 0
            ? (active.completedExercises.length / workout.exercises.length) * 100
            : 0,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [activeWorkouts, workouts]);

  const filteredWorkouts = useMemo(() => {
    return selectedCategory === 'all'
      ? workouts
      : workouts.filter((w) => w.category === selectedCategory);
  }, [workouts, selectedCategory]);

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout/${workoutId}` as any);
  };

  return (
    <View style={styles.container}>
      <StatusBarBlurComponent />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <HomeHeader profile={profile} />
        <SuggestionCard suggestion={suggestionEngine} />
        <ActiveWorkoutSection 
          activeWorkouts={activeWorkoutsWithDetails} 
          onWorkoutPress={handleWorkoutPress}
        />
        <GoalsCard />
        <StatsRow profile={profile} />
        <CategoryFilters 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <WorkoutsSection
          isLoading={isLoading}
          error={error}
          workouts={workouts}
          filteredWorkouts={filteredWorkouts}
          selectedCategory={selectedCategory}
          onWorkoutPress={handleWorkoutPress}
        />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    // paddingBottom handled by insets
  },
});
