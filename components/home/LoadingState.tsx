import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export function LoadingState() {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading workouts...</Text>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
});

