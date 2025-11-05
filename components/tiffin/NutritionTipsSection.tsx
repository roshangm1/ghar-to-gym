import { router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NutritionTip } from '@/types';
import { NutritionTipsGrid } from './NutritionTipsGrid';

interface NutritionTipsSectionProps {
  isLoading: boolean;
  error: Error | null;
  tips: NutritionTip[];
  filteredTips: NutritionTip[];
}

export function NutritionTipsSection({
  isLoading,
  error,
  tips,
  filteredTips,
}: NutritionTipsSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading nutrition tips...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Error loading nutrition tips</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
        <TouchableOpacity
          style={styles.seedButton}
          onPress={() => router.push('/seed-data')}
        >
          <Text style={styles.seedButtonText}>🌱 Setup Database</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (filteredTips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No nutrition tips found</Text>
        <Text style={styles.emptySubtext}>
          {tips.length === 0
            ? 'Seed your database to get started!'
            : 'Try a different category'}
        </Text>
        {tips.length === 0 && (
          <TouchableOpacity
            style={styles.seedButton}
            onPress={() => router.push('/seed-data')}
          >
            <Text style={styles.seedButtonText}>🌱 Setup Database</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return <NutritionTipsGrid tips={filteredTips} />;
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  errorContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
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
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
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

