import { Battery, Moon } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CustomMetricsSectionProps {
  energyLevel: number;
  sleepQuality: number;
  onEnergyUpdate: (value: number) => void;
  onSleepUpdate: (value: number) => void;
}

const energyLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const sleepQualityLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface EnergyLevelMetricProps {
  energyLevel: number;
  onEnergyUpdate: (value: number) => void;
}

function EnergyLevelMetric({ energyLevel, onEnergyUpdate }: EnergyLevelMetricProps) {
  console.log('energyLevel', energyLevel);
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Battery size={20} color={colors.accent} />
        <Text style={styles.metricTitle}>Energy Level</Text>
      </View>
      <Text style={styles.metricDescription}>
        How energetic do you feel today? (1-10)
      </Text>
      <View style={styles.sliderContainer}>
        {energyLevels.map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.sliderButton,
              energyLevel === value && styles.sliderButtonActive,
            ]}
            onPress={() => onEnergyUpdate(value)}
          >
            <Text
              style={[
                styles.sliderButtonText,
                energyLevel === value && styles.sliderButtonTextActive,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.metricValue}>Current: {energyLevel}/10</Text>
    </View>
  );
}

interface SleepQualityMetricProps {
  sleepQuality: number;
  onSleepUpdate: (value: number) => void;
}

function SleepQualityMetric({ sleepQuality, onSleepUpdate }: SleepQualityMetricProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Moon size={20} color={colors.secondary} />
        <Text style={styles.metricTitle}>Sleep Quality</Text>
      </View>
      <Text style={styles.metricDescription}>
        How well did you sleep last night? (1-10)
      </Text>
      <View style={styles.sliderContainer}>
        {sleepQualityLevels.map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.sliderButton,
              sleepQuality === value && styles.sliderButtonActive,
            ]}
            onPress={() => onSleepUpdate(value)}
          >
            <Text
              style={[
                styles.sliderButtonText,
                sleepQuality === value && styles.sliderButtonTextActive,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.metricValue}>Current: {sleepQuality}/10</Text>
    </View>
  );
}

export function CustomMetricsSection({
  energyLevel,
  sleepQuality,
  onEnergyUpdate,
  onSleepUpdate,
}: CustomMetricsSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Battery size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Custom Metrics</Text>
      </View>

      <EnergyLevelMetric
        energyLevel={energyLevel}
        onEnergyUpdate={onEnergyUpdate}
      />

      <SleepQualityMetric
        sleepQuality={sleepQuality}
        onSleepUpdate={onSleepUpdate}
      />
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
  metricCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  metricDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sliderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sliderButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  sliderButtonTextActive: {
    color: colors.background,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
});

