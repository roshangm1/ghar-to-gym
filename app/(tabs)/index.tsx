import { router } from 'expo-router';
import { Clock, Flame, TrendingUp, Target } from 'lucide-react-native';
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
import { useApp } from '@/contexts/AppContext';
import { useWorkouts } from '@/lib/useWorkouts';
import { WorkoutCategory } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';

const CATEGORIES: { id: WorkoutCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '💪' },
  { id: 'strength', label: 'Strength', emoji: '🏋️' },
  { id: 'cardio', label: 'Cardio', emoji: '🏃' },
  { id: 'flexibility', label: 'Yoga', emoji: '🧘' },
  { id: 'cultural', label: 'Cultural', emoji: '🎭' },
];

export default function HomeScreen() {
  const { profile, suggestionEngine } = useApp();
  const colors = useThemeColor();
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | 'all'>('all');
  const styles = createStyles(colors);
  
  // Fetch workouts from InstantDB
  const { isLoading, error, data } = useWorkouts();
  const workouts = data?.workouts || [];

  console.log('workouts', workouts);
  const filteredWorkouts =
    selectedCategory === 'all'
      ? workouts
      : workouts.filter((w) => w.category === selectedCategory);

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout/${workoutId}` as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Namaste, {profile.name}! 🙏</Text>
            <Text style={styles.subtitle}>Let&apos;s get stronger together</Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame color={colors.accent} size={20} />
            <Text style={styles.streakText}>{profile.workoutStreak}</Text>
          </View>
        </View>

        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionText}>{suggestionEngine}</Text>
        </View>

        <TouchableOpacity
          style={styles.goalsCard}
          onPress={() => router.push('/goals')}
          activeOpacity={0.8}
        >
          <View style={styles.goalsCardLeft}>
            <View style={styles.goalsIcon}>
              <Target size={24} color={colors.background} />
            </View>
            <View>
              <Text style={styles.goalsCardTitle}>Goal Packages</Text>
              <Text style={styles.goalsCardSubtitle}>Weight loss, muscle gain & more</Text>
            </View>
          </View>
          <Text style={styles.goalsCardArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <TrendingUp color={colors.primary} size={24} />
            <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Flame color={colors.accent} size={24} />
            <Text style={styles.statValue}>{profile.workoutStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>{profile.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

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
                onPress={() => setSelectedCategory(category.id)}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Workouts' : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
          </Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading workouts...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ Error loading workouts</Text>
              <Text style={styles.errorSubtext}>{error.message}</Text>
              <TouchableOpacity 
                style={styles.seedButton}
                onPress={() => router.push('/seed-data')}
              >
                <Text style={styles.seedButtonText}>🌱 Setup Database</Text>
              </TouchableOpacity>
            </View>
          ) : filteredWorkouts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No workouts found</Text>
              <Text style={styles.emptySubtext}>
                {workouts.length === 0 
                  ? 'Seed your database to get started!' 
                  : 'Try a different category'}
              </Text>
              {workouts.length === 0 && (
                <TouchableOpacity 
                  style={styles.seedButton}
                  onPress={() => router.push('/seed-data')}
                >
                  <Text style={styles.seedButtonText}>🌱 Setup Database</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.workoutsGrid}>
              {filteredWorkouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  style={styles.workoutCard}
                  onPress={() => handleWorkoutPress(workout.id)}
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
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  suggestionCard: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
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
  goalsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
  },
  goalsCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  goalsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsCardTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.background,
    marginBottom: 2,
  },
  goalsCardSubtitle: {
    fontSize: 13,
    color: colors.background,
    opacity: 0.9,
  },
  goalsCardArrow: {
    fontSize: 28,
    color: colors.background,
    fontWeight: '300' as const,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 12,
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
  workoutsGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
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
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  errorContainer: {
    paddingVertical: 40,
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
    paddingVertical: 40,
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
