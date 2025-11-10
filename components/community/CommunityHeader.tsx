import { router } from 'expo-router';
import { Trophy } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

export function CommunityHeader() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  const handleLeaderboardPress = () => {
    router.push('/leaderboard' as any);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>Sangha</Text>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerDescription}>
            See what the Sangha is up to! 🙏
          </Text>
        </View>
        <TouchableOpacity
          style={styles.leaderboardButton}
          onPress={handleLeaderboardPress}
          activeOpacity={0.7}
        >
          <Trophy size={20} color={colors.primary} />
          <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) => StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: insets.top,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
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
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  leaderboardButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
});

