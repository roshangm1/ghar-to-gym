import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Play, CheckCircle } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WorkoutFooterProps {
  isWorkoutCompleted: boolean;
  isWorkoutStarted: boolean;
  isUpdating: boolean;
  allExercisesCompleted: boolean;
  onStartWorkout: () => void;
  onCompleteWorkout: () => void;
}

export function WorkoutFooter({
  isWorkoutCompleted,
  isWorkoutStarted,
  isUpdating,
  allExercisesCompleted,
  onStartWorkout,
  onCompleteWorkout,
}: WorkoutFooterProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  if (isWorkoutCompleted) {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartWorkout}
          activeOpacity={0.8}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <Play size={20} color={colors.background} fill={colors.background} />
              <Text style={styles.startButtonText}>Do Again Today</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  if (!isWorkoutStarted) {
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartWorkout}
          activeOpacity={0.8}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <Play size={20} color={colors.background} fill={colors.background} />
              <Text style={styles.startButtonText}>Start Workout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[
          styles.completeButton,
          (!allExercisesCompleted || isUpdating) && styles.completeButtonDisabled,
        ]}
        onPress={onCompleteWorkout}
        activeOpacity={0.8}
        disabled={!allExercisesCompleted || isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color={colors.background} />
        ) : (
          <>
            <CheckCircle size={20} color={colors.background} />
            <Text style={styles.completeButtonText}>Complete Workout</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) => StyleSheet.create({
  footer: {
    paddingBottom: insets.bottom,
    backgroundColor: colors.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.background,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonDisabled: {
    backgroundColor: colors.textSecondary + '40',
    opacity: 0.6,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.background,
  },
});

