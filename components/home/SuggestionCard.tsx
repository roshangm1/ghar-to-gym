import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface SuggestionCardProps {
  suggestion: string;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.suggestionCard}>
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  suggestionCard: {
    backgroundColor: colors.primary,
    marginHorizontal: 12,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.background,
    textAlign: 'center',
  },
});

