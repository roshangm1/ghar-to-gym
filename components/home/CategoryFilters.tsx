import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { WorkoutCategory } from '@/types';

const CATEGORIES: { id: WorkoutCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '💪' },
  { id: 'strength', label: 'Strength', emoji: '🏋️' },
  { id: 'cardio', label: 'Cardio', emoji: '🏃' },
  { id: 'flexibility', label: 'Yoga', emoji: '🧘' },
  { id: 'cultural', label: 'Cultural', emoji: '🎭' },
];

interface CategoryFiltersProps {
  selectedCategory: WorkoutCategory | 'all';
  onCategoryChange: (category: WorkoutCategory | 'all') => void;
}

export function CategoryFilters({ selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Workout Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => onCategoryChange(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === category.id && styles.categoryLabelActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export { CATEGORIES };

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  categoryLabelActive: {
    color: colors.background,
  },
});

