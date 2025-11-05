import { Trophy, Users, Target, Heart, MessageCircle, Clock, TrendingUp } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { CHALLENGES, LEADERBOARD } from '@/mocks/challenges';
import { SOCIAL_FEED } from '@/mocks/socialFeed';
import { SocialPost } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useStatusBarBlur } from '@/components/StatusBarBlur';

export default function CommunityScreen() {
  const { profile, socialFeed } = useApp();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);
  const { handleScroll, StatusBarBlurComponent } = useStatusBarBlur();

  const combined = [...socialFeed, ...SOCIAL_FEED];
  const allPosts = combined.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const postTime = new Date(timestamp).getTime();
    const diff = now - postTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getPostIcon = (post: SocialPost) => {
    if (post.data?.icon) return post.data.icon;
    switch (post.type) {
      case 'achievement':
        return '🏆';
      case 'workout':
        return '💪';
      case 'milestone':
        return '🎯';
      case 'challenge':
        return '🏔️';
      default:
        return '✨';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBarBlurComponent />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>Sangha</Text>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerDescription}>
            See what the Sangha is up to! 🙏
          </Text>
        </View>

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
            <Text style={styles.miniStatValue}>#{LEADERBOARD.find(l => l.userId === 'current')?.rank || 8}</Text>
            <Text style={styles.miniStatLabel}>Rank</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Activity Feed</Text>
          </View>
          {allPosts.map((post) => {
            const isCurrentUser = post.userId === 'current' || post.userId === profile.id;
            return (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.postAuthor}>
                    <View style={[
                      styles.avatar,
                      isCurrentUser && styles.avatarHighlight,
                    ]}>
                      <Text style={styles.avatarText}>
                        {post.userName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.postAuthorInfo}>
                      <Text style={[
                        styles.postAuthorName,
                        isCurrentUser && styles.postAuthorNameHighlight,
                      ]}>
                        {post.userName}
                      </Text>
                      <View style={styles.postMeta}>
                        <Clock size={12} color={colors.textSecondary} />
                        <Text style={styles.postTime}>
                          {formatTimeAgo(post.timestamp)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.postTypeIcon}>{getPostIcon(post)}</Text>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <Heart size={18} color={colors.textSecondary} />
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
                    <MessageCircle size={18} color={colors.textSecondary} />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Active Challenges</Text>
          </View>
          {CHALLENGES.slice(0, 2).map((challenge) => {
            const progress = (challenge.progress / challenge.goal) * 100;
            return (
              <TouchableOpacity
                key={challenge.id}
                style={styles.challengeCard}
                activeOpacity={0.7}
              >
                <View style={styles.challengeHeader}>
                  <View style={styles.challengeTitleContainer}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeCulturalName}>
                      {challenge.culturalName}
                    </Text>
                  </View>
                  <View style={styles.challengeBadge}>
                    <Text style={styles.challengeBadgeText}>
                      {challenge.type.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(progress, 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {challenge.progress}/{challenge.goal}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: insets.top,
    paddingBottom: 24,
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '400' as const,
  },
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
  section: {
    marginTop: 20,
    paddingHorizontal: 12,
  },
  postCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHighlight: {
    backgroundColor: colors.primary + '20',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  postAuthorNameHighlight: {
    color: colors.primary,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  postTypeIcon: {
    fontSize: 24,
  },
  postContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  challengeCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  challengeTitleContainer: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 2,
  },
  challengeCulturalName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  challengeBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
    minWidth: 50,
    textAlign: 'right',
  },
  leaderboardCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leaderboardRowHighlight: {
    backgroundColor: colors.backgroundSecondary,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeTop: {
    backgroundColor: colors.accent + '20',
  },
  rankEmoji: {
    fontSize: 20,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.text,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  userNameHighlight: {
    color: colors.primary,
    fontWeight: '700' as const,
  },
  userStreak: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userPoints: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  userPointsHighlight: {
    color: colors.primary,
  },
  motivationCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  motivationEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.background,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 15,
    color: colors.background,
    textAlign: 'center',
    opacity: 0.9,
  },
});
