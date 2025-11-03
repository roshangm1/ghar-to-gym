import { router } from 'expo-router';
import { Target, Trophy, Battery, Moon, Scale, LogIn, LogOut } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/lib/useAuth';
import { SeedButton } from '@/lib/SeedButton';

export default function ProfileScreen() {
  const { profile, updateCustomMetric, isAuthenticated } = useApp();
  const { logout } = useAuth();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  const { energyLevel, sleepQuality } = profile.customMetrics;

  const handleEnergyUpdate = (value: number) => {
    updateCustomMetric('energyLevel', value);
  };

  const handleSleepUpdate = (value: number) => {
    updateCustomMetric('sleepQuality', value);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? You can always sign back in to continue tracking your progress.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
        >
          <View style={styles.profileHeader}>
            <Text style={styles.headerSubtitle}>Your Profile</Text>
            <Text style={styles.profileName}>Guest User</Text>
            <Text style={styles.profileEmail}>Sign in to track your progress</Text>
          </View>

          <View style={styles.loginSection}>
            <View style={styles.loginCard}>
              <View style={styles.loginIcon}>
                <LogIn size={32} color={colors.primary} />
              </View>
              <Text style={styles.loginTitle}>Sign In to Unlock</Text>
              <Text style={styles.loginDescription}>
                Log in or create an account to track your workouts, build streaks, unlock achievements, and sync your progress across devices.
              </Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/auth')}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Sign In / Register</Text>
              </TouchableOpacity>
              <Text style={styles.loginSubtext}>
                We&apos;ll send you a magic code to your email
              </Text>
            </View>
          </View>

          <View style={styles.guestInfoSection}>
            <Text style={styles.guestInfoTitle}>What you can do as a guest:</Text>
            <View style={styles.guestInfoList}>
              <View style={styles.guestInfoItem}>
                <Text style={styles.guestInfoBullet}>✓</Text>
                <Text style={styles.guestInfoText}>Browse all workouts</Text>
              </View>
              <View style={styles.guestInfoItem}>
                <Text style={styles.guestInfoBullet}>✓</Text>
                <Text style={styles.guestInfoText}>View nutrition tips</Text>
              </View>
              <View style={styles.guestInfoItem}>
                <Text style={styles.guestInfoBullet}>✓</Text>
                <Text style={styles.guestInfoText}>Explore the community</Text>
              </View>
            </View>
          </View>

          <View style={styles.guestInfoSection}>
            <Text style={styles.guestInfoTitle}>When you sign in:</Text>
            <View style={styles.guestInfoList}>
              <View style={styles.guestInfoItem}>
                <Text style={styles.guestInfoBullet}>🎯</Text>
                <Text style={styles.guestInfoText}>Track workout completions</Text>
              </View>
              <View style={styles.guestInfoItem}>
                <Text style={styles.guestInfoBullet}>🔥</Text>
                <Text style={styles.guestInfoText}>Build and maintain streaks</Text>
              </View>
              <View style={styles.guestInfoItem}>
                <Text style={styles.guestInfoBullet}>🏆</Text>
                <Text style={styles.guestInfoText}>Unlock achievements</Text>
              </View>
              <View style={styles.guestInfoItem}>
                <Text style={styles.guestInfoBullet}>📊</Text>
                <Text style={styles.guestInfoText}>Track your progress over time</Text>
              </View>
              <View style={styles.guestInfoItem}>
                <Text style={styles.guestInfoBullet}>💾</Text>
                <Text style={styles.guestInfoText}>Sync across all devices</Text>
              </View>
            </View>
          </View>

          <SeedButton />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        <View style={styles.profileHeader}>
          <Text style={styles.headerSubtitle}>Your Profile</Text>
          <View style={styles.profileNameContainer}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileEmail}>{profile.email}</Text>
            </View>
          </View>
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <LogOut size={18} color={colors.textSecondary} />
              <Text style={styles.logoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          <SeedButton />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Trophy size={24} color={colors.primary} />
            <Text style={styles.statValue}>{profile.points}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{profile.workoutStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statEmoji}>💪</Text>
            <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Scale size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Weight Goal</Text>
          </View>
          <TouchableOpacity
            style={styles.weightCard}
            onPress={() => router.push('/weight-setup')}
            activeOpacity={0.7}
          >
            {profile.weight ? (
              <View style={styles.weightContent}>
                <View style={styles.weightRow}>
                  <View style={styles.weightItem}>
                    <Text style={styles.weightLabel}>Current</Text>
                    <Text style={styles.weightValue}>
                      {profile.weight.current} {profile.weight.unit}
                    </Text>
                  </View>
                  <Text style={styles.weightArrow}>→</Text>
                  <View style={styles.weightItem}>
                    <Text style={styles.weightLabel}>Target</Text>
                    <Text style={styles.weightValue}>
                      {profile.weight.target} {profile.weight.unit}
                    </Text>
                  </View>
                </View>
                <View style={styles.weightDiff}>
                  <Text style={styles.weightDiffText}>
                    {profile.weight.target - profile.weight.current > 0 ? '+' : ''}
                    {(profile.weight.target - profile.weight.current).toFixed(1)} {profile.weight.unit} to goal
                  </Text>
                </View>
                <Text style={styles.weightEdit}>Tap to edit</Text>
              </View>
            ) : (
              <View style={styles.weightEmptyState}>
                <Scale size={32} color={colors.textSecondary} />
                <Text style={styles.weightEmptyText}>Set Your Weight Goal</Text>
                <Text style={styles.weightEmptySubtext}>
                  Track your progress and get personalized program recommendations
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>My Goals</Text>
          </View>
          {profile.goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>
                    {goal.type === 'workouts' ? '💪 Workout Goal' : '🔥 Streak Goal'}
                  </Text>
                  <Text style={styles.goalProgress}>
                    {goal.current}/{goal.target} {goal.unit}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(progress, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.goalStatus}>
                  {progress >= 100
                    ? '🎉 Goal Achieved!'
                    : `${Math.round(100 - progress)}% to go!`}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Battery size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Custom Metrics</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Battery size={20} color={colors.accent} />
              <Text style={styles.metricTitle}>Energy Level</Text>
            </View>
            <Text style={styles.metricDescription}>
              How energetic do you feel today? (1-10)
            </Text>
            <View style={styles.sliderContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sliderButton,
                    energyLevel === value && styles.sliderButtonActive,
                  ]}
                  onPress={() => handleEnergyUpdate(value)}
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      energyLevel === value && styles.sliderButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.metricValue}>Current: {energyLevel}/10</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Moon size={20} color={colors.secondary} />
              <Text style={styles.metricTitle}>Sleep Quality</Text>
            </View>
            <Text style={styles.metricDescription}>
              How well did you sleep last night? (1-10)
            </Text>
            <View style={styles.sliderContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sliderButton,
                    sleepQuality === value && styles.sliderButtonActive,
                  ]}
                  onPress={() => handleSleepUpdate(value)}
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      sleepQuality === value && styles.sliderButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.metricValue}>Current: {sleepQuality}/10</Text>
          </View>
        </View>

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
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  profileHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: insets.top,
    paddingBottom: 24,
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileActions: {
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.background,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  profileEmail: {
    fontSize: 15,
    color: colors.textSecondary,
  },
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
  goalCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  goalStatus: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  metricCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  metricDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sliderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sliderButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  sliderButtonTextActive: {
    color: colors.background,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
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
  weightCard: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
  },
  weightContent: {
    gap: 16,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  weightItem: {
    alignItems: 'center',
  },
  weightLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  weightArrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  weightDiff: {
    backgroundColor: colors.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  weightDiffText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  weightEdit: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  weightEmptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  weightEmptyText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  weightEmptySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loginSection: {
    padding: 12,
  },
  loginCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  loginIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text,
    textAlign: 'center',
  },
  loginDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.background,
  },
  loginSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  guestInfoSection: {
    padding: 12,
    marginTop: 8,
  },
  guestInfoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  guestInfoList: {
    gap: 12,
  },
  guestInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
  },
  guestInfoBullet: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  guestInfoText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '500' as const,
  },
});
