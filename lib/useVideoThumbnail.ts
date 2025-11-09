import { useState, useEffect } from 'react';
import * as VideoThumbnails from 'expo-video-thumbnails';

/**
 * Hook to generate and cache video thumbnails
 * @param videoUrl - URL of the video
 * @param videoDuration - Duration of the video in seconds (optional, for calculating position)
 * @param options - Options for thumbnail generation
 * @returns thumbnail URI and loading state
 */
export function useVideoThumbnail(
  videoUrl: string | null | undefined,
  videoDuration?: number,
  options?: {
    time?: number; // Time in milliseconds (overrides position)
    quality?: number; // Quality 0-1 (default: 0.8)
    position?: 'start' | 'middle' | 'end' | 'bottom'; // Position to capture from
  }
) {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!videoUrl) {
      setThumbnailUri(null);
      return;
    }

    let isMounted = true;

    const generateThumbnail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let time: number;

        if (options?.time !== undefined) {
          // Use specified time
          time = options.time;
        } else if (options?.position === 'bottom' || options?.position === 'end') {
          // Generate from near the end (80-90% of duration) to get bottom part
          if (videoDuration) {
            time = Math.floor(videoDuration * 0.85 * 1000); // 85% of duration in milliseconds
          } else {
            // Default to a large time value (will be clamped by the library)
            time = 10000; // 10 seconds as fallback
          }
        } else if (options?.position === 'middle') {
          if (videoDuration) {
            time = Math.floor(videoDuration * 0.5 * 1000);
          } else {
            time = 5000; // 5 seconds as fallback
          }
        } else {
          // Default: start of video
          time = 1000; // 1 second
        }

        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
          time,
          quality: options?.quality ?? 0.8,
        });

        if (isMounted) {
          setThumbnailUri(uri);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to generate thumbnail'));
          console.error('Error generating thumbnail:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generateThumbnail();

    return () => {
      isMounted = false;
    };
  }, [videoUrl, videoDuration, options?.time, options?.position, options?.quality]);

  return { thumbnailUri, isLoading, error };
}

/**
 * Generate a thumbnail from a video at a specific time
 * @param videoUrl - URL of the video
 * @param time - Time in milliseconds (or position: 'start' | 'middle' | 'end' | 'bottom')
 * @param quality - Quality 0-1 (default: 0.8)
 * @returns thumbnail URI
 */
export async function generateVideoThumbnail(
  videoUrl: string,
  time?: number | 'start' | 'middle' | 'end' | 'bottom',
  quality: number = 0.8
): Promise<string> {
  try {
    let thumbnailTime: number;

    if (typeof time === 'string') {
      // Need to get video duration first
      const { useVideoPlayer } = await import('expo-video');
      // This is a simplified version - in practice, you'd need to create a player
      // For now, we'll use a reasonable default
      if (time === 'bottom' || time === 'end') {
        // For bottom/end, we'll use a large time value and let the library handle it
        // Or you can pass a specific time in milliseconds
        thumbnailTime = 10000; // 10 seconds as default
      } else if (time === 'middle') {
        thumbnailTime = 5000; // 5 seconds
      } else {
        thumbnailTime = 1000; // 1 second
      }
    } else {
      thumbnailTime = time ?? 1000;
    }

    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
      time: thumbnailTime,
      quality,
    });

    return uri;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
}

