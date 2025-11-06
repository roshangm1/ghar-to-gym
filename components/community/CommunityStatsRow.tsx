import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy, Target, TrendingUp } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserProfile } from '@/types';

interface CommunityStatsRowProps {
  profile: UserProfile;
}

export function CommunityStatsRow({ profile }: CommunityStatsRowProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.statsRow}>
      <View style={styles.miniStatCard}>
        <TrendingUp size={18} color={colors.primary} />
        <Text style={styles.miniStatValue}>{profile.points}</Text>
        <Text style={styles.miniStatLabel}>Points</Text>
      </View>
      <View style={styles.miniStatCard}>
        <Trophy size={18} color={colors.accent} />
        <Text style={styles.miniStatValue}>{profile.workoutStreak}</Text>
        <Text style={styles.miniStatLabel}>Streak</Text>
      </View>
      <View style={styles.miniStatCard}>
        <Target size={18} color={colors.secondary} />
        <Text style={styles.miniStatValue}>#{8}</Text>
        <Text style={styles.miniStatLabel}>Rank</Text>
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
  miniStatCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  miniStatLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});

