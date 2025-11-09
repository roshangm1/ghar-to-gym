import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Target } from 'lucide-react-native';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useChallenges, joinChallenge } from '@/lib/useChallenges';
import { useUserProfile } from '@/lib/useUserData';

export function ChallengesSection() {
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const { userId } = useUserProfile();
  const { challenges, isLoading } = useChallenges(userId);
  const [joiningChallengeId, setJoiningChallengeId] = useState<string | null>(null);

  const handleJoinChallenge = async (challengeId: string) => {
    if (!userId) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to join challenges.',
        [{ text: 'OK' }]
      );
      return;
    }

    setJoiningChallengeId(challengeId);
    try {
      await joinChallenge(userId, challengeId);
      setJoiningChallengeId(null);
      // Challenge progress will be updated automatically on next workout
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to join challenge. Please try again.',
        [{ text: 'OK' }]
      );
      setJoiningChallengeId(null);
    } 
  };

  if (isLoading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={18} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Active Challenges</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (challenges.length === 0) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Target size={18} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>Active Challenges</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active challenges at the moment</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Target size={18} color={colors.textSecondary} />
        <Text style={styles.sectionTitle}>Active Challenges</Text>
      </View>
      {challenges.slice(0, 2).map((challenge) => {
        const progress = (challenge.progress / challenge.goal) * 100;
        const hasJoined = (challenge as any).hasJoined ?? false;
        const isJoining = joiningChallengeId === challenge.id;

        return (
          <TouchableOpacity
            key={challenge.id}
            style={styles.challengeCard}
            activeOpacity={0.7}
            onPress={() => router.push(`/challenges/${challenge.id}` as any)}
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
            {hasJoined ? (
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
            ) : (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleJoinChallenge(challenge.id);
                }}
                disabled={isJoining}
                activeOpacity={0.8}
              >
                {isJoining ? (
                  <ActivityIndicator size="small" color={colors.background} />
                ) : (
                  <Text style={styles.joinButtonText}>Join Challenge</Text>
                )}
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  section: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.text,
  },
  challengeCard: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: '600' as const,
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  joinButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.tint,
  },
  joinButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.text,
  },
});

