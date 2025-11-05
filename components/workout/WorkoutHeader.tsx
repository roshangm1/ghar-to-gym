import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Workout } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WorkoutHeaderProps {
  workout: Workout;
}

export function WorkoutHeader({ workout }: WorkoutHeaderProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <>
      <Image source={{ uri: workout.imageUrl }} style={styles.headerImage} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{workout.title}</Text>
            <Text style={styles.culturalName}>{workout.culturalName}</Text>
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {workout.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  culturalName: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  difficultyBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
});

