import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

export function TiffinHeader() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  return (
    <View style={styles.header}>
      <Text style={styles.headerSubtitle}>Nutrition Guide</Text>
      <Text style={styles.headerTitle}>Tiffin Box 🍱</Text>
      <Text style={styles.headerDescription}>
        Healthy Nepali eating for fitness warriors
      </Text>
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
});

