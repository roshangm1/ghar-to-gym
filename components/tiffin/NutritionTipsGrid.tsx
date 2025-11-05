import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NutritionTip } from '@/types';
import { NutritionTipCard } from './NutritionTipCard';

interface NutritionTipsGridProps {
  tips: NutritionTip[];
}

export function NutritionTipsGrid({ tips }: NutritionTipsGridProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.tipsContainer}>
      {tips.map((tip) => (
        <NutritionTipCard key={tip.id} tip={tip} />
      ))}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  tipsContainer: {
    padding: 12,
    gap: 20,
  },
});

