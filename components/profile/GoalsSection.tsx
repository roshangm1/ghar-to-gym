import { Target } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserGoal, UserProfile } from '@/types';

interface GoalsSectionProps {
  goals: UserGoal[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);
  console.log('goals', goals);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Target size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>My Goals</Text>
      </View>
      {goals.map((goal: UserGoal) => {
        const progress = (goal.current / goal.target) * 100;
        return (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>
                {goal.type === 'workouts' ? '💪 Workout Goal' : '🔥 Streak Goal'}
              </Text>
              <Text style={styles.goalProgress}>
                {goal.current}/{goal.target} {goal.unit}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progress, 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.goalStatus}>
              {progress >= 100
                ? '🎉 Goal Achieved!'
                : `${Math.round(100 - progress)}% to go!`}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  section: {
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  goalCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  goalStatus: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

