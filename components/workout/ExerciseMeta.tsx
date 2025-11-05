import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Flame } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ExerciseMetaProps {
  duration: number;
  caloriesBurn: number;
  totalExercises: number;
}

export function ExerciseMeta({ duration, caloriesBurn, totalExercises }: ExerciseMetaProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.metaRow}>
      <View style={styles.metaCard}>
        <Clock size={20} color={colors.primary} />
        <Text style={styles.metaValue}>{duration}</Text>
        <Text style={styles.metaLabel}>Minutes</Text>
      </View>
      <View style={styles.metaCard}>
        <Flame size={20} color={colors.accent} />
        <Text style={styles.metaValue}>{caloriesBurn}</Text>
        <Text style={styles.metaLabel}>Calories</Text>
      </View>
      <View style={styles.metaCard}>
        <Text style={styles.metaEmoji}>💪</Text>
        <Text style={styles.metaValue}>{totalExercises}</Text>
        <Text style={styles.metaLabel}>Exercises</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  metaCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  metaEmoji: {
    fontSize: 20,
  },
  metaValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

