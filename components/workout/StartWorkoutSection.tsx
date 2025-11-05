import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface StartWorkoutSectionProps {
  isWorkoutCompleted: boolean;
}

export function StartWorkoutSection({ isWorkoutCompleted }: StartWorkoutSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.startWorkoutSection}>
      {isWorkoutCompleted ? (
        <>
          <Text style={styles.completedTodayText}>
            ✅ You completed this workout today!
          </Text>
          <Text style={styles.startWorkoutText}>
            You can start a new session to do it again today, or come back tomorrow for a fresh start.
          </Text>
        </>
      ) : (
        <Text style={styles.startWorkoutText}>
          Start this workout to begin tracking your progress. You&apos;ll be able to mark exercises as complete as you go through them.
        </Text>
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  startWorkoutSection: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    marginHorizontal: 12,
  },
  startWorkoutText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 8,
  },
  completedTodayText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.success,
    textAlign: 'center',
    marginBottom: 8,
  },
});

