import { router } from 'expo-router';
import { 
  Trophy,
  Medal,
  ArrowLeft,
} from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useLeaderboard } from '@/lib/useChallenges';
import { useUserProfile } from '@/lib/useUserData';
import { useStatusBarBlur } from '@/components/StatusBarBlur';

export default function LeaderboardScreen() {
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const { userId } = useUserProfile();
  const { leaderboard, isLoading } = useLeaderboard(100); // Get top 100 users
  const { handleScroll, StatusBarBlurComponent } = useStatusBarBlur();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={24} color="#FFD700" />;
    if (rank === 2) return <Medal size={24} color="#C0C0C0" />;
    if (rank === 3) return <Medal size={24} color="#CD7F32" />;
    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBarBlurComponent />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBarBlurComponent />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Leaderboard List */}
        <View style={styles.leaderboardCard}>
          {leaderboard.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users yet. Be the first to earn points! 🏆</Text>
            </View>
          ) : (
            <View style={styles.leaderboardList}>
              {leaderboard.map((entry) => {
                const isCurrentUser = entry.userId === userId;
                const rankIcon = getRankIcon(entry.rank);

                return (
                  <View
                    key={entry.id}
                    style={[
                      styles.leaderboardItem,
                      isCurrentUser && styles.leaderboardItemCurrent,
                    ]}
                  >
                    <View style={styles.leaderboardRank}>
                      {rankIcon || (
                        <Text style={styles.leaderboardRankText}>{entry.rank}</Text>
                      )}
                    </View>
                    {entry.avatar ? (
                      <Image
                        source={{ uri: entry.avatar }}
                        style={styles.leaderboardAvatar}
                      />
                    ) : (
                      <View style={styles.leaderboardAvatarPlaceholder}>
                        <Text style={styles.leaderboardAvatarText}>
                          {entry.userName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.leaderboardInfo}>
                      <Text
                        style={[
                          styles.leaderboardName,
                          isCurrentUser && styles.leaderboardNameCurrent,
                        ]}
                      >
                        {entry.userName}
                        {isCurrentUser && ' (You)'}
                      </Text>
                      <View style={styles.leaderboardStats}>
                        <Text style={styles.leaderboardPoints}>
                          {entry.points.toLocaleString()} points
                        </Text>
                        <Text style={styles.leaderboardStreak}>
                          🔥 {entry.streak} day streak
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  leaderboardCard: {
    margin: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  leaderboardList: {
    gap: 0,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leaderboardItemCurrent: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  leaderboardRank: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardRankText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.textSecondary,
  },
  leaderboardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
  },
  leaderboardAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardAvatarText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  leaderboardInfo: {
    flex: 1,
    gap: 6,
  },
  leaderboardName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  leaderboardNameCurrent: {
    color: colors.primary,
    fontWeight: '700' as const,
  },
  leaderboardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leaderboardPoints: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  leaderboardStreak: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

