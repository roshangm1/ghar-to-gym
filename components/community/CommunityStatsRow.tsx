import { useThemeColor } from '@/hooks/useThemeColor';
import { useLeaderboard } from '@/lib/useChallenges';
import { Target, TrendingUp, Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CommunityStatsRowProps {
  userId: string;
  points: number;
  streak: number;
}

export function CommunityStatsRow({ userId, points, streak }: CommunityStatsRowProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const { leaderboard } = useLeaderboard(100);
  const userRank = leaderboard.find((user) => user.userId === userId)?.rank;

  return (
    <View style={styles.statsRow}>
      <View style={styles.miniStatCard}>
        <TrendingUp size={18} color={colors.primary} />
        <Text style={styles.miniStatValue}>{points}</Text>
        <Text style={styles.miniStatLabel}>Points</Text>
      </View>
      <View style={styles.miniStatCard}>
        <Trophy size={18} color={colors.accent} />
        <Text style={styles.miniStatValue}>{streak}</Text>
        <Text style={styles.miniStatLabel}>Streak</Text>
      </View>
      <View style={styles.miniStatCard}>
        <Target size={18} color={colors.secondary} />
        <Text style={styles.miniStatValue}>#{userRank}</Text>
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

