import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ErrorStateProps {
  error: Error | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>❌ Error loading workouts</Text>
      <Text style={styles.errorSubtext}>{error?.message}</Text>
      <TouchableOpacity 
        style={styles.seedButton}
        onPress={() => router.push('/seed-data')}
      >
        <Text style={styles.seedButtonText}>🌱 Setup Database</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  errorContainer: {
    paddingVertical: 40,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  seedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  seedButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});

