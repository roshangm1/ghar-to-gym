import { Flame } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserProfile } from '@/types';

interface HomeHeaderProps {
  profile: UserProfile;
}

export function HomeHeader({ profile }: HomeHeaderProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.streakBadge}>
          <Flame color={colors.accent} size={18} fill={colors.accent} />
          <Text style={styles.streakText}>{profile.workoutStreak} day streak</Text>
        </View>
      </View>
      <Text style={styles.greeting}>Namaste,</Text>
      <Text style={styles.nameText}>{profile.name}! 🙏</Text>
      <Text style={styles.subtitle}>Let&apos;s get stronger together</Text>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) => StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: insets.top,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '400' as const,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent + '15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.accent + '25',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.accent,
  },
});

