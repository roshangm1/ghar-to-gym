import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Target } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CHALLENGES } from '@/mocks/challenges';

export function ChallengesSection() {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
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
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 12,
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
});

