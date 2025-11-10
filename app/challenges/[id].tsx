import { router, useLocalSearchParams } from 'expo-router';
import { 
  Target, 
  Calendar, 
  Users,
  Trophy,
  TrendingUp,
  Award,
  Clock,
  Medal,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
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
import { useNow } from '@/hooks/useNow';
import { useChallenges, useUserChallengeProgress, joinChallenge, useChallengeLeaderboard } from '@/lib/useChallenges';
import { useUserProfile } from '@/lib/useUserData';
import { WorkoutCategory } from '@/types';

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const { userId } = useUserProfile();
  const { challenges, isLoading } = useChallenges(userId);
  const { progress: userProgress, isLoading: progressLoading } = useUserChallengeProgress(
    userId,
    id as string
  );
  const { leaderboard, isLoading: leaderboardLoading } = useChallengeLeaderboard(id as string);

  const challenge = useMemo(() => {
    return challenges.find((c) => c.id === id);
  }, [challenges, id]);

  const now = useNow();

  // Calculate days remaining dynamically using dayjs
  const daysRemaining = useMemo(() => {
    if (!challenge?.endDate) return 0;
    const endDate = dayjs(challenge.endDate);
    const diff = endDate.diff(now, 'day', true);
    return Math.max(0, Math.ceil(diff));
  }, [challenge?.endDate, now]);

  if (isLoading || progressLoading || leaderboardLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!challenge) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Challenge not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const progress = userProgress?.progress || challenge.progress || 0;
  const progressPercentage = (progress / challenge.goal) * 100;
  const isCompleted = userProgress?.completed || false;

  const getMetricLabel = () => {
    switch (challenge.metricType) {
      case 'streak':
        return 'Day Streak';
      case 'workout_count_weekly':
        return 'Workouts This Week';
      case 'workout_count_monthly':
        return 'Workouts This Month';
      case 'workout_count':
      default:
        return 'Total Workouts';
    }
  };

  const getCategoryLabel = (category?: WorkoutCategory) => {
    if (!category) return null;
    const labels: Record<WorkoutCategory, string> = {
      strength: 'Strength',
      cardio: 'Cardio',
      flexibility: 'Flexibility',
      cultural: 'Cultural',
      yoga: 'Yoga',
      mindfulness: 'Mindfulness',
    };
    return labels[category];
  };

  const handleJoinChallenge = async () => {
    if (!userId) {
      return;
    }
    try {
      await joinChallenge(userId, challenge.id);
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{challenge.title}</Text>
              <Text style={styles.culturalName}>{challenge.culturalName}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {challenge.type.toUpperCase()}
                </Text>
              </View>
              {challenge.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {getCategoryLabel(challenge.category)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{challenge.description}</Text>

          {/* Progress Section */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View style={styles.progressInfo}>
                <Target size={24} color={colors.primary} />
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressLabel}>{getMetricLabel()}</Text>
                  <Text style={styles.progressValue}>
                    {progress} / {challenge.goal}
                  </Text>
                </View>
              </View>
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Trophy size={20} color={colors.success} />
                  <Text style={styles.completedText}>Completed!</Text>
                </View>
              )}
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(progressPercentage, 100)}%`,
                      backgroundColor: isCompleted ? colors.success : colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Calendar size={24} color={colors.primary} />
              <Text style={styles.statValue}>
                {daysRemaining > 0 ? daysRemaining : 0}
              </Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={24} color={colors.secondary} />
              <Text style={styles.statValue}>{challenge.participants}</Text>
              <Text style={styles.statLabel}>Participants</Text>
            </View>
            <View style={styles.statCard}>
              <Award size={24} color={colors.accent} />
              <Text style={styles.statValue}>{challenge.goal}</Text>
              <Text style={styles.statLabel}>Goal</Text>
            </View>
          </View>

          {/* Reward Section */}
          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Trophy size={24} color={colors.primary} />
              <Text style={styles.rewardTitle}>Reward</Text>
            </View>
            <Text style={styles.rewardText}>{challenge.reward}</Text>
          </View>

          {/* Challenge Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Clock size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Ends on {new Date(challenge.endDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
            {challenge.category && (
              <View style={styles.infoRow}>
                <TrendingUp size={20} color={colors.textSecondary} />
                <Text style={styles.infoText}>
                  Category: {getCategoryLabel(challenge.category)} workouts only
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Target size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Track: {getMetricLabel()}
              </Text>
            </View>
          </View>

          {/* Leaderboard Section */}
          {leaderboard.length > 0 && (
            <View style={styles.leaderboardCard}>
              <View style={styles.leaderboardHeader}>
                <Trophy size={24} color={colors.primary} />
                <Text style={styles.leaderboardTitle}>Leaderboard</Text>
              </View>
              <View style={styles.leaderboardList}>
                {leaderboard.map((entry) => {
                  const isCurrentUser = entry.userId === userId;
                  const getRankIcon = () => {
                    if (entry.rank === 1) return <Trophy size={20} color="#FFD700" />;
                    if (entry.rank === 2) return <Medal size={20} color="#C0C0C0" />;
                    if (entry.rank === 3) return <Medal size={20} color="#CD7F32" />;
                    return null;
                  };
                  
                  return (
                    <View
                      key={entry.id}
                      style={[
                        styles.leaderboardItem,
                        isCurrentUser && styles.leaderboardItemCurrent,
                      ]}
                    >
                      <View style={styles.leaderboardRank}>
                        {getRankIcon() || (
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
                        <Text style={styles.leaderboardProgress}>
                          {entry.progress} {getMetricLabel().toLowerCase()}
                          {entry.completed && ' ✓'}
                        </Text>
                      </View>
                      {entry.completed && (
                        <View style={styles.completedBadgeSmall}>
                          <Trophy size={16} color={colors.success} />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Join Button */}
          {!userProgress && userId && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinChallenge}
              activeOpacity={0.8}
            >
              <Text style={styles.joinButtonText}>Join Challenge</Text>
            </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.background,
  },
  content: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  culturalName: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  typeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.success,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    minWidth: 50,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  rewardText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  infoSection: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  joinButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.background,
  },
  leaderboardCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  leaderboardItemCurrent: {
    backgroundColor: colors.primary + '15',
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  leaderboardRank: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardRankText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.textSecondary,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  leaderboardAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardAvatarText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  leaderboardInfo: {
    flex: 1,
    gap: 4,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  leaderboardNameCurrent: {
    color: colors.primary,
  },
  leaderboardProgress: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  completedBadgeSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

