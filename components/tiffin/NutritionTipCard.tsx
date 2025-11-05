import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { NutritionTip } from '@/types';

interface NutritionTipCardProps {
  tip: NutritionTip;
}

export function NutritionTipCard({ tip }: NutritionTipCardProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  const nutritionInfo = tip.nutritionInfo;

  return (
    <View style={styles.tipCard}>
      <Image source={{ uri: tip.imageUrl }} style={styles.tipImage} />
      <View style={styles.tipContent}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipTitle}>{tip.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {tip.category.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.tipDescription}>{tip.description}</Text>

        {nutritionInfo && (nutritionInfo.calories || nutritionInfo.protein || nutritionInfo.carbs || nutritionInfo.fat) && (
          <View style={styles.nutritionInfo}>
            {nutritionInfo.calories && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>{nutritionInfo.calories}</Text>
              </View>
            )}
            {nutritionInfo.protein && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>{nutritionInfo.protein}g</Text>
              </View>
            )}
            {nutritionInfo.carbs && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>{nutritionInfo.carbs}g</Text>
              </View>
            )}
            {nutritionInfo.fat && (
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionValue}>{nutritionInfo.fat}g</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Pro Tips:</Text>
          {tip.tips.map((tipText: string, index: number) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipBullet}>✓</Text>
              <Text style={styles.tipText}>{tipText}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  tipCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  tipContent: {
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  nutritionInfo: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  tipsSection: {
    gap: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 8,
  },
  tipBullet: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '700' as const,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

