import { ChefHat, Leaf, TrendingDown } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNutrition } from '@/lib/useNutrition';
import { NutritionTip } from '@/types';

const CATEGORIES = [
  { id: 'all' as const, label: 'All', icon: ChefHat },
  { id: 'dal-bhat' as const, label: 'Dal-Bhat', icon: Leaf },
  { id: 'momo' as const, label: 'Momo', icon: ChefHat },
  { id: 'traditional' as const, label: 'Traditional', icon: Leaf },
  { id: 'modern' as const, label: 'Modern', icon: TrendingDown },
];

export default function TiffinScreen() {
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | NutritionTip['category']
  >('all');

  // Fetch nutrition tips from InstantDB
  const { isLoading, error, data } = useNutrition();
  const nutritionTips = data?.nutritionTips || [];

  const filteredTips =
    selectedCategory === 'all'
      ? nutritionTips
      : nutritionTips.filter((tip) => tip.category === selectedCategory);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tiffin Box</Text>
          <Text style={styles.headerSubtitle}>
            Healthy Nepali eating for fitness warriors
          </Text>
        </View>

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
                  onPress={() => setSelectedCategory(category.id)}
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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading nutrition tips...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ Error loading nutrition tips</Text>
            <Text style={styles.errorSubtext}>{error.message}</Text>
            <TouchableOpacity
              style={styles.seedButton}
              onPress={() => router.push('/seed-data')}
            >
              <Text style={styles.seedButtonText}>🌱 Setup Database</Text>
            </TouchableOpacity>
          </View>
        ) : filteredTips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No nutrition tips found</Text>
            <Text style={styles.emptySubtext}>
              {nutritionTips.length === 0
                ? 'Seed your database to get started!'
                : 'Try a different category'}
            </Text>
            {nutritionTips.length === 0 && (
              <TouchableOpacity
                style={styles.seedButton}
                onPress={() => router.push('/seed-data')}
              >
                <Text style={styles.seedButtonText}>🌱 Setup Database</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.tipsContainer}>
            {filteredTips.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
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

                  {(tip.calories || tip.protein || tip.carbs || tip.fat) && (
                    <View style={styles.nutritionInfo}>
                      {tip.calories && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Calories</Text>
                          <Text style={styles.nutritionValue}>{tip.calories}</Text>
                        </View>
                      )}
                      {tip.protein && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Protein</Text>
                          <Text style={styles.nutritionValue}>{tip.protein}g</Text>
                        </View>
                      )}
                      {tip.carbs && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Carbs</Text>
                          <Text style={styles.nutritionValue}>{tip.carbs}g</Text>
                        </View>
                      )}
                      {tip.fat && (
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Fat</Text>
                          <Text style={styles.nutritionValue}>{tip.fat}g</Text>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>Pro Tips:</Text>
                    {tip.tips.map((tipText, index) => (
                      <View key={index} style={styles.tipItem}>
                        <Text style={styles.tipBullet}>✓</Text>
                        <Text style={styles.tipText}>{tipText}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    backgroundColor: colors.background,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoriesSection: {
    marginTop: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
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
  tipsContainer: {
    padding: 20,
    gap: 20,
  },
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
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  errorContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  seedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  seedButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
