import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ErrorStateProps {
  error?: Error | null;
}

export function ErrorState({ error }: ErrorStateProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, styles.centerContent]}>
      <Text style={styles.errorText}>
        {error ? '❌ Error loading workout' : 'Workout not found'}
      </Text>
      {error && <Text style={styles.errorSubtext}>{error.message}</Text>}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  backButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});

