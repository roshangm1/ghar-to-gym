import { useLocalSearchParams, router } from 'expo-router';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useWorkout } from '@/lib/useWorkouts';
import { useUserProfile, useUserWorkoutInstance, updateExerciseCompletion, startUserWorkout } from '@/lib/useUserData';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Square, CheckSquare, Volume2, VolumeX } from 'lucide-react-native';
import PagerView from 'react-native-pager-view';
import BottomSheet, { BottomSheetView, useBottomSheet, useBottomSheetInternal } from '@gorhom/bottom-sheet';
import { useAnimatedReaction, runOnJS, useSharedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MuteButtonProps {
  player: ReturnType<typeof useVideoPlayer>;
  colors: ReturnType<typeof useThemeColor>;
  insets: ReturnType<typeof useSafeAreaInsets>;
}

function MuteButton({ player, colors, insets }: MuteButtonProps) {
  const styles = createStyles(colors, insets);
  const [isMuted, setIsMuted] = useState(true);

  // Sync with player's initial muted state
  useEffect(() => {
    setIsMuted(player.muted);
  }, [player]);

  const handleToggleMute = useCallback(() => {
    const newMutedState = !player.muted;
    // expo-video requires direct property assignment for muted state
    // Using player prop directly avoids ref mutation issues with worklets
    // eslint-disable-next-line react-compiler/react-compiler
    player.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [player]);

  return (
    <TouchableOpacity
      style={styles.muteButton}
      onPress={handleToggleMute}
      activeOpacity={0.7}
    >
      <View style={styles.muteButtonInner}>
        {isMuted ? (
          <VolumeX size={24} color="#FFFFFF" />
        ) : (
          <Volume2 size={24} color="#FFFFFF" />
        )}
      </View>
    </TouchableOpacity>
  );
}

interface BottomSheetContentProps {
  exercise: {
    id: string;
    name: string;
    videoUrl?: string;
    reps?: string;
    duration?: number;
    instructions: string[];
  };
  index: number;
  isCompleted: boolean;
  colors: ReturnType<typeof useThemeColor>;
  insets: ReturnType<typeof useSafeAreaInsets>;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onToggleComplete: () => void;
}

function BottomSheetContent({
  exercise,
  index,
  isCompleted,
  colors,
  insets,
  isExpanded,
  setIsExpanded,
  onToggleComplete,
}: BottomSheetContentProps) {
  const styles = createStyles(colors, insets);
  const { animatedPosition } = useBottomSheetInternal();
  const bsRef = useBottomSheet();
  
  // Track sheet position to detect expansion state
  // When minimized, position is near 0 (at bottom)
  // When expanded, position increases (sheet pulled up)
  const minimizedHeightRef = useRef(0);
  const lastPosition = useSharedValue(0);
  
  useAnimatedReaction(
    () => animatedPosition?.value ?? 0,
    (position) => {
      if (minimizedHeightRef.current > 0) {
        // Calculate thresholds based on minimized height
        const minimizedHeight = minimizedHeightRef.current;
        const expandedThreshold = minimizedHeight * 1.2; // 120% of minimized height = expanded
        
        // Determine if we're expanded based on position
        // When position is above the threshold, show expanded content
        // When position is below, hide expanded content (minimized)
        const shouldBeExpanded = position > expandedThreshold;
        
        // Check position change to avoid flickering
        const positionDelta = Math.abs(position - lastPosition.value);
        
        // Only update state if there's a significant change to avoid flickering
        if (positionDelta > 5) { // 5px threshold to avoid micro-updates
          if (shouldBeExpanded) {
            runOnJS(setIsExpanded)(true);
          } else {
            // Position is low, minimize
            runOnJS(setIsExpanded)(false);
          }
        }
        
        lastPosition.value = position;
      }
    },
    []
  );
  
  // Measure minimized content to use as threshold
  const handleMinimizedLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    minimizedHeightRef.current = height;
  }, []);

  return (
    <BottomSheetView style={styles.bottomSheetContent}>
      <BlurView
        intensity={80}
        tint="dark"
        style={styles.bottomSheetBlur}
        
      >
        <Pressable 
          onPress={() => bsRef.expand()}
          style={styles.minimizedContent} 
          collapsable={false}
          onLayout={handleMinimizedLayout}
        >
          <View style={styles.headerRowMinimized}>
            <View style={styles.exerciseNumber}>
              <Text style={styles.exerciseNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.reps && (
                <Text style={styles.exerciseMeta}>{exercise.reps}</Text>
              )}
              {exercise.duration && (
                <Text style={styles.exerciseMeta}>
                  {exercise.duration} seconds
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={onToggleComplete}
              activeOpacity={0.7}
              style={styles.checkboxButton}
            >
              {isCompleted ? (
                <CheckSquare size={24} color={colors.success} />
              ) : (
                <Square size={24} color="#FFFFFF" opacity={0.7} />
              )}
            </TouchableOpacity>
          </View>
        </Pressable>

        {/* Expanded view - instructions (always rendered, hidden when minimized) */}
        <View 
          style={[
            styles.expandedContent,
            !isExpanded && styles.expandedContentHidden
          ]} 
          collapsable={false}
        >
          <View style={styles.completeSection}>
            <TouchableOpacity
              onPress={onToggleComplete}
              activeOpacity={0.7}
              style={styles.completeButton}
            >
              {isCompleted ? (
                <CheckSquare size={24} color={colors.success} />
              ) : (
                <Square size={24} color="#FFFFFF" opacity={0.7} />
              )}
              <Text style={styles.completeText}>
                {isCompleted ? 'Completed' : 'Mark as complete'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {exercise.instructions.map((instruction, i) => (
              <View key={i} style={styles.instructionItem}>
                <Text style={styles.instructionBullet}>•</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </BlurView>
    </BottomSheetView>
  );
}

interface VideoItemProps {
  exercise: {
    id: string;
    name: string;
    videoUrl?: string;
    reps?: string;
    duration?: number;
    instructions: string[];
  };
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  onToggleComplete: () => void;
}

function VideoItem({ exercise, index, isCompleted, isActive, onToggleComplete }: VideoItemProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);
  const playerRef = useRef<VideoView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Preload video - create player immediately
  const player = useVideoPlayer(exercise.videoUrl || '', (player) => {
    player.loop = true;
    player.muted = true;
    // Preload the video but don't play yet
    player.pause();
  });

  useEffect(() => {
    if (isActive && exercise.videoUrl) {
      // Auto-play when active
      player.play();
      setIsPlaying(true);
      // Start with expanded view
      setIsExpanded(true);
    } else {
      // Pause when not active (but keep loaded for preloading)
      player.pause();
      setIsPlaying(false);
      // Collapse to minimized when video becomes inactive
      setIsExpanded(false);
    }
  }, [isActive, player, exercise.videoUrl]);

  // With dynamic sizing, we don't need to measure heights manually
  // The sheet will automatically size to fit the visible content

  const handlePlayPause = useCallback(() => {
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  }, [player]);

  if (!exercise.videoUrl) {
    return (
      <View style={styles.container}>
        <View style={styles.noVideoContainer}>
          <Text style={styles.noVideoText}>No video available for this exercise</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={handlePlayPause}
        style={styles.videoContainer}
      >
        <VideoView
          ref={playerRef}
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
      </Pressable>
      
      {/* Overlay with details */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonInner}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Exercise info - Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          enablePanDownToClose={false}
          backgroundStyle={styles.bottomSheetBackground}
          enableDynamicSizing={true}
          animateOnMount={true}
          snapPoints={[110]}
          index={0}
          handleComponent={() => null}
        >
          <BottomSheetContent 
            exercise={exercise}
            index={index}
            isCompleted={isCompleted}
            colors={colors}
            insets={insets}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            onToggleComplete={onToggleComplete}
          />
        </BottomSheet>

        {/* Mute/Unmute button */}
        <MuteButton player={player} colors={colors} insets={insets} />

        {/* Play/Pause button overlay - only show when paused */}
        {!isPlaying && (
          <TouchableOpacity
            style={styles.playPauseButton}
            onPress={handlePlayPause}
            activeOpacity={0.7}
          >
            <View style={styles.playPauseIcon}>
              <Text style={styles.playPauseText}>▶</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function WorkoutVideosScreen() {
  const { id, workoutId, initialIndex } = useLocalSearchParams<{ 
    id?: string; 
    workoutId?: string; 
    initialIndex?: string;
  }>();
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);
  
  // Use workoutId if provided, otherwise use id
  const actualWorkoutId = workoutId || id || '';
  const { isLoading, error, data } = useWorkout(actualWorkoutId);
  const workout = data?.workout;

  // Get user profile and authentication
  const { userId } = useUserProfile();
  const { isAuthenticated } = useApp();

  // Fetch user workout instance to sync completion status
  const { status, completedExercises: dbCompletedExercises, isLoading: instanceLoading } = useUserWorkoutInstance(
    userId,
    actualWorkoutId
  );

  // Get exercises with videos
  const exercisesWithVideos = workout?.exercises.filter((ex) => ex.videoUrl) || [];
  
  // Find the starting index - if initialIndex is provided, find the exercise with that id
  let startIndex = 0;
  if (initialIndex) {
    if (id && !workoutId) {
      // If id is the exercise ID, find its index
      const exerciseIndex = exercisesWithVideos.findIndex((ex) => ex.id === id);
      startIndex = exerciseIndex >= 0 ? exerciseIndex : 0;
    } else {
      startIndex = parseInt(initialIndex, 10) || 0;
    }
  }

  // Initialize state before early returns
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set(dbCompletedExercises));
  const pagerRef = useRef<PagerView>(null);
  const initialPageSetRef = useRef(false);

  // Sync local state with database state
  useEffect(() => {
    setCompletedExercises(new Set(dbCompletedExercises));
  }, [dbCompletedExercises]);

  const isWorkoutStarted = status === 'in_progress' || status === 'completed';

  // Handle page selection
  const handlePageSelected = useCallback((e: any) => {
    const newIndex = e.nativeEvent.position;
    setCurrentIndex(newIndex);
  }, []);

  // Toggle exercise completion
  const toggleExerciseComplete = useCallback(async (exerciseId: string) => {
    if (!isAuthenticated || !userId) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to track exercise completion.',
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

    // If workout not started, start it first
    if (!isWorkoutStarted) {
      try {
        await startUserWorkout(userId, actualWorkoutId);
      } catch (error: any) {
        Alert.alert(
          'Error',
          error.message || 'Failed to start workout. Please try again.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const isCompleted = completedExercises.has(exerciseId);
    
    // Optimistically update local state
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (isCompleted) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });

    // Update in database
    try {
      await updateExerciseCompletion(userId, actualWorkoutId, exerciseId, !isCompleted);
    } catch (error: any) {
      // Revert optimistic update on error
      setCompletedExercises((prev) => {
        const newSet = new Set(prev);
        if (isCompleted) {
          newSet.add(exerciseId);
        } else {
          newSet.delete(exerciseId);
        }
        return newSet;
      });
      Alert.alert(
        'Error',
        error.message || 'Failed to update exercise. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [isAuthenticated, userId, isWorkoutStarted, completedExercises, actualWorkoutId]);

  // Set initial page only once on mount
  useEffect(() => {
    if (!initialPageSetRef.current && pagerRef.current && startIndex > 0) {
      initialPageSetRef.current = true;
      // Small delay to ensure PagerView is ready
      const timer = setTimeout(() => {
        pagerRef.current?.setPage(startIndex);
        setCurrentIndex(startIndex);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [startIndex]);

  if (isLoading || instanceLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  if (error || !workout || exercisesWithVideos.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error ? 'Error loading videos' : 'No videos available'}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <StatusBar hidden translucent />
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={startIndex}
        orientation="vertical"
        onPageSelected={handlePageSelected}
        // Preload adjacent pages for better performance
        offscreenPageLimit={1}
      >
        {exercisesWithVideos.map((exercise, index) => (
          <View key={exercise.id} style={styles.page}>
            <VideoItem
              exercise={exercise}
              index={index}
              isCompleted={completedExercises.has(exercise.id)}
              isActive={index === currentIndex}
              onToggleComplete={() => toggleExerciseComplete(exercise.id)}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) => StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    top: insets.top,
    left: 16,
    zIndex: 10,
  },
  backButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  
  bottomSheetBackground: {
    backgroundColor: 'transparent',
  },
  bottomSheetIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetBlur: {
    minHeight: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  minimizedContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'center',
    height: 100
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: insets.bottom,
  },
  expandedContentHidden: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  completeSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  completeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  headerRowMinimized: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxButton: {
    padding: 4,
  },
  exerciseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.background,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  exerciseMeta: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    fontWeight: '600' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  instructionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  instructionBullet: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700' as const,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    opacity: 0.95,
    fontWeight: '500' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  muteButton: {
    position: 'absolute',
    top: insets.top,
    right: 16,
    zIndex: 10,
  },
  muteButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 5,
  },
  playPauseIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  playPauseText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '700' as const,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noVideoText: {
    fontSize: 18,
    color: colors.background,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 18,
    color: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.background,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600' as const,
  },
});

