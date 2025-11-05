import { router } from 'expo-router';
import { Scale } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserProfile } from '@/types';

interface WeightGoalSectionProps {
  profile: UserProfile;
}

export function WeightGoalSection({ profile }: WeightGoalSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
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
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
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
});

