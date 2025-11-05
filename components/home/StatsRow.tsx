import { Flame, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserProfile } from '@/types';

interface StatsRowProps {
  profile: UserProfile;
}

export function StatsRow({ profile }: StatsRowProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <TrendingUp color={colors.primary} size={24} />
        <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
        <Text style={styles.statLabel}>Total Workouts</Text>
      </View>
      <View style={styles.statCard}>
        <Flame color={colors.accent} size={24} />
        <Text style={styles.statValue}>{profile.workoutStreak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statEmoji}>⭐</Text>
        <Text style={styles.statValue}>{profile.points}</Text>
        <Text style={styles.statLabel}>Points</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
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

