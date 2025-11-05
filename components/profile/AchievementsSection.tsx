import { Trophy } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserProfile } from '@/types';

interface AchievementsSectionProps {
  profile: UserProfile;
}

export function AchievementsSection({ profile }: AchievementsSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Trophy size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Achievements</Text>
      </View>
      <View style={styles.achievementsGrid}>
        {profile.achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <Text style={styles.achievementTitle} numberOfLines={2}>
              {achievement.title}
            </Text>
            <Text style={styles.achievementDescription} numberOfLines={2}>
              {achievement.description}
            </Text>
          </View>
        ))}
        <View style={styles.achievementCard}>
          <Text style={styles.achievementIconLocked}>🔒</Text>
          <Text style={styles.achievementTitleLocked}>More Coming</Text>
        </View>
      </View>
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
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  achievementIconLocked: {
    fontSize: 40,
    marginBottom: 8,
    opacity: 0.3,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

