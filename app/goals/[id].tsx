import { router, useLocalSearchParams } from 'expo-router';
import { 
  ChevronRight, 
  Clock, 
  Target, 
  Calendar, 
  TrendingUp, 
  UtensilsCrossed,
  CheckCircle2,
  PlayCircle
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FITNESS_PROGRAMS } from '@/mocks/fitnessPrograms';
import { WORKOUTS } from '@/mocks/workouts';

export default function FitnessProgramDetailScreen() {
  const { id } = useLocalSearchParams();
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const [selectedMealDay, setSelectedMealDay] = useState(0);
  
  const program = FITNESS_PROGRAMS.find((p) => p.id === id);

  if (!program) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Program not found</Text>
        </View>
      </View>
    );
  }

  const programWorkouts = WORKOUTS.filter((w) => program.workouts.includes(w.id));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: program.imageUrl }} style={styles.heroImage} />
        
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{program.title}</Text>
            <Text style={styles.culturalName}>{program.culturalName}</Text>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{program.difficulty.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.description}>{program.description}</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Calendar size={24} color={colors.primary} />
              <Text style={styles.metricValue}>{program.duration}</Text>
              <Text style={styles.metricLabel}>Weeks</Text>
            </View>
            <View style={styles.metricCard}>
              <Target size={24} color={colors.secondary} />
              <Text style={styles.metricValue}>{program.workouts.length}</Text>
              <Text style={styles.metricLabel}>Workouts</Text>
            </View>
            {program.targetMetrics.workoutsPerWeek && (
              <View style={styles.metricCard}>
                <TrendingUp size={24} color={colors.accent} />
                <Text style={styles.metricValue}>{program.targetMetrics.workoutsPerWeek}</Text>
                <Text style={styles.metricLabel}>Per Week</Text>
              </View>
            )}
          </View>

          {program.targetMetrics.weightChange && (
            <View style={styles.targetCard}>
              <Text style={styles.targetTitle}>🎯 Your Target</Text>
              <Text style={styles.targetValue}>
                {program.targetMetrics.weightChange > 0 ? '+' : ''}
                {program.targetMetrics.weightChange}kg
              </Text>
              <Text style={styles.targetSubtext}>
                {program.targetMetrics.caloriesPerDay} calories/day
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <PlayCircle size={22} color={colors.primary} />
              <Text style={styles.sectionTitle}>Workout Plan</Text>
            </View>
            {programWorkouts.map((workout, index) => (
              <TouchableOpacity
                key={workout.id}
                style={styles.workoutItem}
                onPress={() => router.push(`/workout/${workout.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.workoutLeft}>
                  <View style={styles.workoutNumber}>
                    <Text style={styles.workoutNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                    <View style={styles.workoutMeta}>
                      <Clock size={14} color={colors.textSecondary} />
                      <Text style={styles.workoutMetaText}>{workout.duration} min</Text>
                      <Text style={styles.workoutMetaSeparator}>•</Text>
                      <Text style={styles.workoutMetaText}>{workout.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UtensilsCrossed size={22} color={colors.primary} />
              <Text style={styles.sectionTitle}>Meal Plan</Text>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayTabs}
            >
              {program.mealPlans.map((plan, index) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.dayTab,
                    selectedMealDay === index && styles.dayTabActive,
                  ]}
                  onPress={() => setSelectedMealDay(index)}
                >
                  <Text
                    style={[
                      styles.dayTabText,
                      selectedMealDay === index && styles.dayTabTextActive,
                    ]}
                  >
                    {plan.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {program.mealPlans[selectedMealDay] && (
              <View style={styles.mealsContainer}>
                {program.mealPlans[selectedMealDay].meals.map((meal, index) => (
                  <View key={index} style={styles.mealCard}>
                    <View style={styles.mealHeader}>
                      <View>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        {meal.culturalName && (
                          <Text style={styles.mealCulturalName}>{meal.culturalName}</Text>
                        )}
                      </View>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                    <View style={styles.mealItems}>
                      {meal.items.map((item, idx) => (
                        <View key={idx} style={styles.mealItemRow}>
                          <CheckCircle2 size={16} color={colors.primary} />
                          <Text style={styles.mealItem}>{item}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.caloriesTag}>
                      <Text style={styles.caloriesText}>{meal.calories} cal</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.totalCalories}>
                  <Text style={styles.totalCaloriesText}>
                    Total Daily Calories:{' '}
                    {program.mealPlans[selectedMealDay].meals.reduce(
                      (sum, meal) => sum + meal.calories,
                      0
                    )}{' '}
                    cal
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💡 Expert Tips</Text>
            </View>
            {program.tips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
            <Text style={styles.startButtonText}>Start This Program</Text>
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  culturalName: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  targetCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.background,
    marginBottom: 8,
  },
  targetValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.background,
    marginBottom: 4,
  },
  targetSubtext: {
    fontSize: 14,
    color: colors.background,
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  workoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  workoutNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutNumberText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.background,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workoutMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  workoutMetaSeparator: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  dayTabs: {
    gap: 8,
    paddingBottom: 16,
  },
  dayTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  dayTabTextActive: {
    color: colors.background,
  },
  mealsContainer: {
    gap: 12,
  },
  mealCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 2,
  },
  mealCulturalName: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  mealTime: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  mealItems: {
    gap: 8,
    marginBottom: 12,
  },
  mealItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealItem: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  caloriesTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  caloriesText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.accent,
  },
  totalCalories: {
    backgroundColor: colors.primary + '15',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalCaloriesText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.secondary,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.background,
  },
});
