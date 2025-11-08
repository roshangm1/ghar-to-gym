import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Users } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SocialPost } from '@/types';
import { PostCard } from './PostCard';

interface ActivityFeedSectionProps {
  posts: SocialPost[];
  isLoading: boolean;
  currentUserId: string | null;
  onLike: (post: SocialPost) => void;
}

export function ActivityFeedSection({ 
  posts, 
  isLoading, 
  currentUserId, 
  onLike,
}: ActivityFeedSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  const formatTimeAgo = useCallback((timestamp: string) => {
    const now = new Date().getTime();
    const postTime = new Date(timestamp).getTime();
    const diff = now - postTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  }, []);

  const getPostIcon = useCallback((post: SocialPost) => {
    if (post.data?.icon) return post.data.icon;
    switch (post.type) {
      case 'achievement':
        return '🏆';
      case 'workout':
        return '💪';
      case 'milestone':
        return '🎯';
      case 'challenge':
        return '🏔️';
      default:
        return '✨';
    }
  }, []);

  const handleLike = useCallback((post: SocialPost) => {
    onLike(post);
  }, [onLike]);

  if (isLoading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Activity Feed</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Activity Feed</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts yet. Be the first to share your progress! 💪</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Users size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Activity Feed</Text>
      </View>
      {posts.map((post) => {
        const isCurrentUser = post.userId === currentUserId;
        return (
          <PostCard
            key={post.id}
            post={post}
            isCurrentUser={isCurrentUser}
            onLike={() => handleLike(post)}
            formatTimeAgo={formatTimeAgo}
            getPostIcon={getPostIcon}
          />
        );
      })}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

