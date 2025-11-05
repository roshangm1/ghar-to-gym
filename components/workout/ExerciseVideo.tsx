import { Clock, Flame, Play, CheckCircle } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Exercise } from '@/types';
import { useEvent } from 'expo';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

interface ExerciseVideoProps {
  exercise: Exercise;
  index: number;
  isCompleted: boolean;
  onToggle: (exerciseId: string) => void;
}

export function ExerciseVideo({
  exercise,
  index,
  isCompleted,
  onToggle,
}: ExerciseVideoProps) {
  const colors = useThemeColor();
  const playerRef = useRef<VideoView>(null);

  const player = useVideoPlayer(exercise.videoUrl || '', (player) => {
    player.loop = false;
    player.muted = false;
  });

  useEvent(player, 'playingChange', { isPlaying: player.playing });

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
        <TouchableOpacity
          style={videoStyles.videoContainer}
          onPress={() => {
            // Pause the current video
            player.pause();
            // Navigate to video reels screen
            const workoutId = (exercise as any).workoutId;
            if (workoutId) {
              router.push({
                pathname: '/workout/[id]/videos',
                params: {
                  workoutId,
                  initialIndex: index.toString(),
                },
              });
            }
          }}
          activeOpacity={0.9}
        >
          <VideoView
            ref={playerRef}
            player={player}
            style={videoStyles.video}
            contentFit="cover"
            nativeControls={false}
          />
          <View style={styles.playOverlay}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </TouchableOpacity>
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
});

