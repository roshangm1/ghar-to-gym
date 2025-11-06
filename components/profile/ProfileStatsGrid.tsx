import { Trophy } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserProfile } from '@/types';

interface ProfileStatsGridProps {
  points: number;
  workoutStreak: number;
  totalWorkouts: number;
}

export function ProfileStatsGrid({ points, workoutStreak, totalWorkouts }: ProfileStatsGridProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.statsGrid}>
      <View style={styles.statBox}>
        <Trophy size={24} color={colors.primary} />
        <Text style={styles.statValue}>{points}</Text>
        <Text style={styles.statLabel}>Total Points</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statEmoji}>🔥</Text>
        <Text style={styles.statValue}>{workoutStreak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      <View style={styles.statBox}>
        <Text style={styles.statEmoji}>💪</Text>
        <Text style={styles.statValue}>{totalWorkouts}</Text>
        <Text style={styles.statLabel}>Workouts</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

