import { router } from 'expo-router';
import { Play } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Workout } from '@/types';

interface ActiveWorkout {
  instanceId: string;
  workoutId: string;
  workout: Workout;
  completedExercises: string[];
  progress: number;
}

interface ActiveWorkoutSectionProps {
  activeWorkouts: ActiveWorkout[];
  onWorkoutPress: (workoutId: string) => void;
}

export function ActiveWorkoutSection({ activeWorkouts, onWorkoutPress }: ActiveWorkoutSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  if (activeWorkouts.length === 0) {
    return null;
  }

  return (
    <View style={styles.activeWorkoutSection}>
      <Text style={styles.activeWorkoutTitle}>Active Workout</Text>
      {activeWorkouts.map((active) => (
        <TouchableOpacity
          key={active.instanceId}
          style={styles.activeWorkoutCard}
          onPress={() => onWorkoutPress(active.workoutId)}
          activeOpacity={0.8}
        >
          <View style={styles.activeWorkoutLeft}>
            <View style={styles.activeWorkoutIcon}>
              <Play size={20} color={colors.primary} fill={colors.primary} />
            </View>
            <View style={styles.activeWorkoutInfo}>
              <Text style={styles.activeWorkoutName} numberOfLines={1}>
                {active.workout.title}
              </Text>
              <View style={styles.activeWorkoutProgress}>
                <View
                  style={[
                    styles.activeWorkoutProgressBar,
                    { width: `${active.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.activeWorkoutProgressText}>
                {active.completedExercises.length} / {active.workout.exercises.length} exercises
              </Text>
            </View>
          </View>
          <Text style={styles.activeWorkoutArrow}>→</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  activeWorkoutSection: {
    marginHorizontal: 12,
    marginTop: 16,
  },
  activeWorkoutTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  activeWorkoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  activeWorkoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  activeWorkoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeWorkoutInfo: {
    flex: 1,
    gap: 6,
  },
  activeWorkoutName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  activeWorkoutProgress: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  activeWorkoutProgressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  activeWorkoutProgressText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  activeWorkoutArrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '300' as const,
  },
});

