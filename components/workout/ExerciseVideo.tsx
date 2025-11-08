import { CheckCircle } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Exercise } from '@/types';
import { useEvent } from 'expo';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';

const CONTAINER_HEIGHT = 220;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface ExerciseVideoProps {
  exercise: Exercise;
  index: number;
  isCompleted: boolean;
  onToggle: (exerciseId: string) => void;
}

const VideoWithInstructions = ({ videoUrl, index, workoutId, instructions }: { videoUrl: string, index: number, workoutId: string, instructions: string[] }) => {

  const colors = useThemeColor();
  const playerRef = useRef<VideoView>(null);

  const player = useVideoPlayer(videoUrl || '', (player) => {
    player.loop = false;
    player.muted = false;
  });

  const estimatedVideoHeight = SCREEN_WIDTH * 1.78; // Rough estimate for 9:16 portrait
  const extraHeight = estimatedVideoHeight - CONTAINER_HEIGHT;
  const videoOffset = -(extraHeight * 0.40); // Negative = shift down to show bottom

  useEvent(player, 'playingChange', { isPlaying: player.playing });
  const styles = createStyles(colors, videoOffset);
  return (
    <>
    {videoUrl && (
        <TouchableOpacity
          style={styles.videoContainer}
          onPress={() => {
            // Pause the current video
            player.pause();
            // Navigate to video reels screen
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
          }}
          activeOpacity={0.9}
        >
          <View style={styles.videoWrapper}>
            <VideoView
              ref={playerRef}
              player={player}
              style={styles.video}
              contentFit="cover"
              nativeControls={false}
            />
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
      <VideoWithInstructions workoutId={exercise.workoutId} videoUrl={exercise.videoUrl || ''} index={index} instructions={exercise.instructions} />
      
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, videoOffset?: number) => StyleSheet.create({
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
  video: {
    width: '100%',
    // Make video taller to allow for translation
    // For portrait videos with cover mode, the video will be scaled
    // to fill the width, making it taller than the container
    height: '200%', // Make it 200% height to have room for translation
    transform: [{ translateY: videoOffset || 0 }], // Shift video down to show bottom part
  },
});

