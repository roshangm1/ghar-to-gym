import { useLocalSearchParams, router } from 'expo-router';
import { Clock, Flame, Play, CheckCircle } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useApp } from '@/contexts/AppContext';
import { useWorkout } from '@/lib/useWorkouts';
import { Exercise } from '@/types';
import { useEvent } from 'expo';
import { useThemeColor } from '@/hooks/useThemeColor';

function ExerciseVideo({ 
  exercise, 
  index, 
  isCompleted, 
  onToggle 
}: { 
  exercise: Exercise;
  index: number;
  isCompleted: boolean;
  onToggle: (exerciseId: string) => void;
}) {
  console.log('re-rendering ExerciseVideo', exercise);
  const colors = useThemeColor();
  const playerRef = useRef<VideoView>(null);

  const player = useVideoPlayer(exercise.videoUrl || '', (player) => {
    player.loop = false;
    player.muted = false;
    
  });

  useEvent(player, 'playingChange', { isPlaying: player.playing,  });

  const videoStyles = StyleSheet.create({
    videoContainer: {
      width: '100%',
      height: 220,
      backgroundColor: '#000',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 12,
      position: 'relative',
    },
    video: {
      width: '100%',
      height: '100%',
    },
  });

  const styles = createStyles(colors);

  return (
    <View
      style={[
        styles.exerciseCard,
        isCompleted && styles.exerciseCardCompleted,
      ]}
    >
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseNumber}>
          <Text style={styles.exerciseNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {exercise.reps && (
            <Text style={styles.exerciseReps}>{exercise.reps}</Text>
          )}
          {exercise.duration && (
            <Text style={styles.exerciseReps}>
              {exercise.duration} seconds
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={() => onToggle(exercise.id)}>
          {isCompleted ? (
            <CheckCircle size={24} color={colors.success} />
          ) : (
            <View style={styles.uncheckedCircle} />
          )}
        </TouchableOpacity>
      </View>

      {exercise.videoUrl && (
        <View style={videoStyles.videoContainer}>
          <VideoView
            ref={playerRef}
            player={player}
            style={videoStyles.video}
            contentFit="cover"
            fullscreenOptions={{ orientation: 'landscape', enable: true,  }}
          />
        </View>
      )}

      <View style={styles.instructionsContainer}>
        {exercise.instructions.map((instruction: string, i: number) => (
          <View key={i} style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const ExerciseMeta = ({ duration, caloriesBurn, totalExercises }: { duration: number, caloriesBurn: number, totalExercises: number }) => {
  const colors = useThemeColor();

  const styles = createStyles(colors);


  return (<View style={styles.metaRow}>
    <View style={styles.metaCard}>
      <Clock size={20} color={colors.primary} />
      <Text style={styles.metaValue}>{duration}</Text>
      <Text style={styles.metaLabel}>Minutes</Text>
    </View>
    <View style={styles.metaCard}>
      <Flame size={20} color={colors.accent} />
      <Text style={styles.metaValue}>{caloriesBurn}</Text>
      <Text style={styles.metaLabel}>Calories</Text>
    </View>
    <View style={styles.metaCard}>
      <Text style={styles.metaEmoji}>💪</Text>
      <Text style={styles.metaValue}>{totalExercises}</Text>
      <Text style={styles.metaLabel}>Exercises</Text>
    </View>
  </View>
);
}

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { logWorkout, isAuthenticated } = useApp();
  const colors = useThemeColor();
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );
  
  // Fetch workout from InstantDB
  const { isLoading, error, data } = useWorkout(id as string);
  const workout = data?.workout;
  const styles = createStyles(colors);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading workout...</Text>
      </View>
    );
  }

  if (error || !workout) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          {error ? '❌ Error loading workout' : 'Workout not found'}
        </Text>
        {error && <Text style={styles.errorSubtext}>{error.message}</Text>}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleExercise = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleCompleteWorkout = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to complete workouts and track your progress.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Login',
            onPress: () => router.push('/auth'),
          },
        ]
      );
      return;
    }

    const allCompleted = workout.exercises.every((ex) =>
      completedExercises.has(ex.id)
    );

    if (!allCompleted) {
      Alert.alert(
        'Incomplete Workout',
        'Complete all exercises before finishing the workout.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await logWorkout({
        workoutId: workout.id,
        date: new Date().toISOString(),
        duration: workout.duration,
        caloriesBurned: workout.caloriesBurn,
        energyBefore: 7,
        energyAfter: 8,
      });

      Alert.alert(
        'Workout Complete! 🎉',
        `Great job! You earned 50 points and burned ${workout.caloriesBurn} calories!`,
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Failed to complete workout. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: workout.imageUrl }} style={styles.headerImage} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{workout.title}</Text>
              <Text style={styles.culturalName}>{workout.culturalName}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>
                {workout.difficulty.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{workout.description}</Text>

          <ExerciseMeta duration={workout.duration} caloriesBurn={workout.caloriesBurn} totalExercises={workout.exercises.length} />

          {workout.equipment.length > 0 && (
            <View style={styles.equipmentSection}>
              <Text style={styles.sectionTitle}>Equipment Needed</Text>
              <View style={styles.equipmentList}>
                {workout.equipment.map((item: string, index: number) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Text style={styles.equipmentText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {workout.equipment.length === 0 && (
            <View style={styles.noEquipmentBanner}>
              <Text style={styles.noEquipmentText}>
                ✓ No equipment needed - Perfect for home workouts!
              </Text>
            </View>
          )}

          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {workout.exercises.map((exercise, index) => {
              const isCompleted = completedExercises.has(exercise.id);
              return (
                <ExerciseVideo
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  isCompleted={isCompleted}
                  onToggle={toggleExercise}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteWorkout}
          activeOpacity={0.8}
        >
          <Play size={20} color={colors.background} fill={colors.background} />
          <Text style={styles.completeButtonText}>Complete Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  culturalName: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  difficultyBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.background,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metaCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  metaEmoji: {
    fontSize: 20,
  },
  metaValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  equipmentSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentItem: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  equipmentText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500' as const,
  },
  noEquipmentBanner: {
    backgroundColor: colors.success + '15',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  noEquipmentText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.success,
    textAlign: 'center',
  },
  exercisesSection: {
    marginBottom: 100,
  },
  exerciseCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  exerciseCardCompleted: {
    borderColor: colors.success,
    backgroundColor: colors.success + '08',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.background,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  exerciseReps: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500' as const,
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  instructionsContainer: {
    gap: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 8,
  },
  instructionBullet: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700' as const,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.background,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  backButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
