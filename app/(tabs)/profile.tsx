import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useApp } from '@/contexts/AppContext';
import { SeedButton } from '@/lib/SeedButton';
import { useStatusBarBlur } from '@/components/StatusBarBlur';
import {
  ProfileHeader,
  GuestProfileHeader,
  GuestLoginSection,
  GuestInfoSection,
  ProfileStatsGrid,
  WeightGoalSection,
  GoalsSection,
  CustomMetricsSection,
  AchievementsSection,
} from '@/components/profile';

export default function ProfileScreen() {
  const { profile, updateCustomMetric, isAuthenticated } = useApp();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const { handleScroll, StatusBarBlurComponent } = useStatusBarBlur();

  const { energyLevel, sleepQuality } = profile.customMetrics;
  const {achievements} = profile;
  

  const handleEnergyUpdate = (value: number) => {
    updateCustomMetric('energyLevel', value);
  };

  const handleSleepUpdate = (value: number) => {
    updateCustomMetric('sleepQuality', value);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBarBlurComponent />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <GuestProfileHeader />
          <GuestLoginSection />
          <GuestInfoSection
            title="What you can do as a guest:"
            items={[
              { bullet: '✓', text: 'Browse all workouts' },
              { bullet: '✓', text: 'View nutrition tips' },
              { bullet: '✓', text: 'Explore the community' },
            ]}
          />
          <GuestInfoSection
            title="When you sign in:"
            items={[
              { bullet: '🎯', text: 'Track workout completions' },
              { bullet: '🔥', text: 'Build and maintain streaks' },
              { bullet: '🏆', text: 'Unlock achievements' },
              { bullet: '📊', text: 'Track your progress over time' },
              { bullet: '💾', text: 'Sync across all devices' },
            ]}
          />
          {/* <SeedButton /> */}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBarBlurComponent />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <ProfileHeader name={profile.name} avatar={profile.avatar || ''} email={profile.email || ''} />
        {/* <SeedButton /> */}
        <ProfileStatsGrid points={profile.points} workoutStreak={profile.workoutStreak} totalWorkouts={profile.totalWorkouts} />
        <WeightGoalSection weight={profile.weight || { current: 0, target: 0, unit: 'kg' }} />
        <GoalsSection goals={profile.goals} />
        <CustomMetricsSection
          energyLevel={energyLevel}
          sleepQuality={sleepQuality}
          onEnergyUpdate={handleEnergyUpdate}
          onSleepUpdate={handleSleepUpdate}
        />
        <AchievementsSection achievements={achievements} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
