import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Exercise } from '@/types';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { useVideoThumbnail } from '@/lib/useVideoThumbnail';

const CONTAINER_HEIGHT = 220;

interface ExerciseVideoProps {
  exercise: Exercise;
  index: number;
  isCompleted: boolean;
  onToggle: (exerciseId: string) => void;
  workoutId?: string;
}

const VideoWithInstructions = ({ videoUrl, index, workoutId, instructions }: { videoUrl: string, index: number, workoutId: string, instructions: string[] }) => {

  const colors = useThemeColor();
  
  // Generate thumbnail from video
  const { thumbnailUri, isLoading } = useVideoThumbnail(videoUrl, undefined, {
    position: 'bottom', // Get thumbnail from bottom part of video
    quality: 0.8,
  });

  const styles = createStyles(colors);
  
  const handlePress = () => {
    if (workoutId) {
      router.push({
        pathname: '/workout/[id]/videos',
        params: {
          id: workoutId,
          workoutId,
          initialIndex: index.toString(),
        },
      });
    }
  };

  return (
    <>
    {videoUrl && (
        <TouchableOpacity
          style={styles.videoContainer}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <View style={styles.videoWrapper}>
            {isLoading ? (
              <View style={styles.thumbnailLoading}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : thumbnailUri ? (
              <Image
                source={{ uri: thumbnailUri }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.thumbnailPlaceholderText}>No thumbnail</Text>
              </View>
            )}
          </View>
          <View style={styles.playOverlay}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.instructionsContainer}>
        {instructions.map((instruction: string, i: number) => (
          <View key={i} style={styles.instructionItem}>
            <Text style={styles.instructionBullet}>•</Text>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        ))}
      </View>
    </>
  )

}

export function ExerciseVideo({
  exercise,
  index,
  isCompleted,
  onToggle,
  workoutId,
}: ExerciseVideoProps) {
  const colors = useThemeColor();
  
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
      <VideoWithInstructions workoutId={workoutId || ''} videoUrl={exercise.videoUrl || ''} index={index} instructions={exercise.instructions} />
      
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
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
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playIcon: {
    fontSize: 48,
    color: '#fff',
    opacity: 0.9,
  },
  videoContainer: {
    width: '100%',
    height: CONTAINER_HEIGHT,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailLoading: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailPlaceholderText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.5,
  },
});

