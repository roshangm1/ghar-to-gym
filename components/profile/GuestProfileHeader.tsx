import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

export function GuestProfileHeader() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  return (
    <View style={styles.profileHeader}>
      <Text style={styles.headerSubtitle}>Your Profile</Text>
      <Text style={styles.profileName}>Guest User</Text>
      <Text style={styles.profileEmail}>Sign in to track your progress</Text>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) => StyleSheet.create({
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
});

