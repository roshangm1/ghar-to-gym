import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNutrition } from '@/lib/useNutrition';
import { NutritionTip } from '@/types';
import { useStatusBarBlur } from '@/components/StatusBarBlur';
import {
  TiffinHeader,
  NutritionCategoryFilters,
  NutritionTipsSection,
} from '@/components/tiffin';

export default function TiffinScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | NutritionTip['category']
  >('all');
  const { handleScroll, StatusBarBlurComponent } = useStatusBarBlur();

  // Fetch nutrition tips from InstantDB
  const { isLoading, error: errorData, data } = useNutrition();
  const nutritionTips = useMemo(() => (data?.nutritionTips || []) as NutritionTip[], [data?.nutritionTips]);
  const error = errorData ? (errorData as Error) : null;

  const filteredTips = useMemo(() => {
    return selectedCategory === 'all'
      ? nutritionTips
      : nutritionTips.filter((tip) => tip.category === selectedCategory);
  }, [nutritionTips, selectedCategory]);

  return (
    <View style={styles.container}>
      <StatusBarBlurComponent />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <TiffinHeader />
        <NutritionCategoryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <NutritionTipsSection
          isLoading={isLoading}
          error={error}
          tips={nutritionTips}
          filteredTips={filteredTips}
        />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
});
