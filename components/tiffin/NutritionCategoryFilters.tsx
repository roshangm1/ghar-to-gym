import { ChefHat, Leaf, TrendingDown } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NutritionTip } from '@/types';

const CATEGORIES = [
  { id: 'all' as const, label: 'All', icon: ChefHat },
  { id: 'dal-bhat' as const, label: 'Dal-Bhat', icon: Leaf },
  { id: 'momo' as const, label: 'Momo', icon: ChefHat },
  { id: 'traditional' as const, label: 'Traditional', icon: Leaf },
  { id: 'modern' as const, label: 'Modern', icon: TrendingDown },
];

interface NutritionCategoryFiltersProps {
  selectedCategory: 'all' | NutritionTip['category'];
  onCategoryChange: (category: 'all' | NutritionTip['category']) => void;
}

export function NutritionCategoryFilters({ selectedCategory, onCategoryChange }: NutritionCategoryFiltersProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.categoriesSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive,
              ]}
              onPress={() => onCategoryChange(category.id)}
            >
              <Icon
                size={16}
                color={isActive ? colors.background : colors.text}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  isActive && styles.categoryLabelActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  categoriesSection: {
    marginTop: 16,
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
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  categoryLabelActive: {
    color: colors.background,
  },
});

