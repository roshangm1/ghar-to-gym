import { router, Stack } from 'expo-router';
import { Target, Clock, TrendingDown, Flame, Wind, Dumbbell } from 'lucide-react-native';
import React from 'react';
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
import { FitnessProgram } from '@/types';
import { useApp } from '@/contexts/AppContext';

const GOAL_TYPE_INFO = {
  'weight-loss': {
    icon: TrendingDown,
    color: '#E74C3C',
    emoji: '⚖️',
  },
  'muscle-gain': {
    icon: Dumbbell,
    color: '#8E44AD',
    emoji: '💪',
  },
  'flexibility': {
    icon: Wind,
    color: '#16A085',
    emoji: '🧘',
  },
  'endurance': {
    icon: Flame,
    color: '#F39C12',
    emoji: '🏃',
  },
};

export default function FitnessProgramsScreen() {
  const { profile } = useApp();
  const colors = useThemeColor();
  const styles = createStyles(colors);

  const handleProgramPress = (programId: string) => {
    router.push(`/goals/${programId}` as any);
  };

  // Get recommended program based on user's weight goal
  const getRecommendedPrograms = () => {
    if (!profile.weight?.current || !profile.weight?.target) {
      return FITNESS_PROGRAMS;
    }

    const weightDiff = profile.weight.target - profile.weight.current;
    const recommendedType = weightDiff < -2 ? 'weight-loss' : 
                           weightDiff > 2 ? 'muscle-gain' : 
                           'flexibility';

    // Sort: recommended type first, then others
    return [...FITNESS_PROGRAMS].sort((a, b) => {
      if (a.goalType === recommendedType && b.goalType !== recommendedType) return -1;
      if (a.goalType !== recommendedType && b.goalType === recommendedType) return 1;
      return 0;
    });
  };

  const programs = getRecommendedPrograms();

  const renderProgramCard = (program: FitnessProgram, index: number) => {
    const typeInfo = GOAL_TYPE_INFO[program.goalType];
    const Icon = typeInfo.icon;
    const isRecommended = index === 0 && profile.weight?.current && profile.weight?.target;

    return (
      <TouchableOpacity
        key={program.id}
        style={styles.programCard}
        onPress={() => handleProgramPress(program.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: program.imageUrl }} style={styles.programImage} />
        <View style={styles.programOverlay}>
          <View style={[styles.typeIconBadge, { backgroundColor: typeInfo.color }]}>
            <Icon size={20} color="#fff" />
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{program.difficulty.toUpperCase()}</Text>
          </View>
        </View>
        {isRecommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>✨ RECOMMENDED FOR YOU</Text>
          </View>
        )}
        <View style={styles.programInfo}>
          <Text style={styles.programTitle}>{program.title}</Text>
          <Text style={styles.programCulturalName}>{program.culturalName}</Text>
          <Text style={styles.programDescription} numberOfLines={2}>
            {program.description}
          </Text>
          <View style={styles.programMeta}>
            <View style={styles.metaItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{program.duration} weeks</Text>
            </View>
            <View style={styles.metaItem}>
              <Target size={16} color={typeInfo.color} />
              <Text style={styles.metaText}>
                {program.workouts.length} workouts
              </Text>
            </View>
          </View>
          {program.targetMetrics.weightChange && (
            <View style={styles.targetBanner}>
              <Text style={styles.targetText}>
                {typeInfo.emoji} Target: {program.targetMetrics.weightChange > 0 ? '+' : ''}
                {program.targetMetrics.weightChange}kg
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Journey Awaits</Text>
          <Text style={styles.headerSubtitle}>
            Choose a program that aligns with your fitness goals
          </Text>
          {profile.weight?.current && profile.weight?.target && (
            <View style={styles.weightGoalBanner}>
              <Text style={styles.weightGoalText}>
                🎯 Your Goal: {profile.weight.current}{profile.weight.unit} → {profile.weight.target}{profile.weight.unit}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.categoriesContainer}>
          {Object.entries(GOAL_TYPE_INFO).map(([key, info]) => {
            const Icon = info.icon;
            const count = FITNESS_PROGRAMS.filter((p) => p.goalType === key).length;
            return (
              <View key={key} style={styles.categoryPill}>
                <Icon size={16} color={info.color} />
                <Text style={[styles.categoryPillText, { color: info.color }]}>
                  {key.replace('-', ' ').toUpperCase()} ({count})
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.programsSection}>
          {programs.map((program, index) => renderProgramCard(program, index))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Each program includes curated workouts, meal plans, and expert tips
            tailored to Nepali lifestyle and cuisine.
          </Text>
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
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  weightGoalBanner: {
    marginTop: 12,
    backgroundColor: colors.primary + '15',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  weightGoalText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  programsSection: {
    paddingHorizontal: 20,
    gap: 16,
  },
  programCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
  },
  programImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 170,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    paddingVertical: 6,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.background,
    textAlign: 'center',
    letterSpacing: 1,
  },
  programOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
  programInfo: {
    padding: 16,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  programCulturalName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  programMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  targetBanner: {
    backgroundColor: colors.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  targetText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

