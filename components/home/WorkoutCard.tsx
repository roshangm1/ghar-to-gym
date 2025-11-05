import { Clock, Flame } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Workout } from '@/types';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: workout.imageUrl }} style={styles.workoutImage} />
      <View style={styles.workoutOverlay}>
        <View style={styles.workoutBadge}>
          <Text style={styles.workoutBadgeText}>
            {workout.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutTitle} numberOfLines={1}>
          {workout.title}
        </Text>
        <Text style={styles.workoutCulturalName} numberOfLines={1}>
          {workout.culturalName}
        </Text>
        <View style={styles.workoutMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{workout.duration} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Flame size={14} color={colors.accent} />
            <Text style={styles.metaText}>{workout.caloriesBurn} cal</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  workoutCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
  },
  workoutImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  workoutOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  workoutBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  workoutBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
  workoutInfo: {
    padding: 16,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  workoutCulturalName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
});

