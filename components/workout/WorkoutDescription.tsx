import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WorkoutDescriptionProps {
  description: string;
}

export function WorkoutDescription({ description }: WorkoutDescriptionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);
  console.log('description', description);

  return <Text style={styles.description}>{description}</Text>;
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
});

