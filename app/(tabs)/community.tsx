import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LegendList } from '@legendapp/list';
import { useApp } from '@/contexts/AppContext';
import { useSocialFeed, toggleLikePost, loadMoreSocialPosts } from '@/lib/useSocialFeed';
import { SocialPost } from '@/types';
import { useStatusBarBlur } from '@/components/StatusBarBlur';
import { useUserProfile } from '@/lib/useUserData';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  CommunityHeader,
  CommunityStatsRow,
  ChallengesSection,
  PostCard,
} from '@/components/community';
import { Users } from 'lucide-react-native';

const POSTS_PER_PAGE = 10;

export default function CommunityScreen() {
  const { profile } = useApp();
  const { userId } = useUserProfile();
  const [offset, setOffset] = useState(0);
  const { posts: dbPosts, isLoading: postsLoading, hasMore: dbHasMore } = useSocialFeed(userId, POSTS_PER_PAGE, 0);
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const { handleScroll, StatusBarBlurComponent } = useStatusBarBlur();
  const [optimisticLikes, setOptimisticLikes] = useState<Map<string, { isLiked: boolean; likes: number }>>(new Map());
  const [allPosts, setAllPosts] = useState<SocialPost[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const allPostsRef = useRef<SocialPost[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
    hasMoreRef.current = hasMore;
    allPostsRef.current = allPosts;
  }, [isLoadingMore, hasMore, allPosts]);

  // Update allPosts when dbPosts change (initial load)
  // Only update if dbPosts actually changed (not just a new array reference)
  const dbPostsIds = useMemo(() => dbPosts.map(p => p.id).join(','), [dbPosts]);
  const prevDbPostsIdsRef = useRef<string>('');
  
  useEffect(() => {
    if (postsLoading) return;
    
    // Only update if dbPosts IDs actually changed and offset is 0 (initial load)
    if (dbPostsIds !== prevDbPostsIdsRef.current && offset === 0) {
      prevDbPostsIdsRef.current = dbPostsIds;
      
      if (dbPosts.length > 0) {
        setAllPosts(dbPosts);
        setHasMore(dbHasMore);
        hasMoreRef.current = dbHasMore;
      } else {
        setAllPosts([]);
        setHasMore(false);
        hasMoreRef.current = false;
      }
    }
  }, [dbPostsIds, postsLoading, dbPosts, dbHasMore, offset]);

  // Merge database posts with optimistic updates
  const posts = useMemo(() => {
    return allPosts.map((post) => {
      const optimistic = optimisticLikes.get(post.id);
      if (optimistic) {
        return {
          ...post,
          isLiked: optimistic.isLiked,
          likes: optimistic.likes,
        };
      }
      return post;
    });
  }, [allPosts, optimisticLikes]);

  const handleLoadMore = useCallback(async () => {
    // Use refs to prevent multiple simultaneous loads
    if (isLoadingMoreRef.current || !hasMoreRef.current || allPostsRef.current.length === 0) {
      return;
    }

    setIsLoadingMore(true);
    isLoadingMoreRef.current = true;
    
    // Calculate next offset
    const nextOffset = allPostsRef.current.length;
    
    let result: { posts: SocialPost[]; hasMore: boolean } | null = null;
    
    // Load posts using InstantDB's offset-based pagination
    const loadPromise = loadMoreSocialPosts(userId, nextOffset, POSTS_PER_PAGE);
    
    result = await loadPromise.catch((error) => {
      console.error('Error loading more posts:', error);
      return null;
    });
    
    // Handle success case
    if (result !== null) {
      if (result.posts.length > 0) {
        setAllPosts((prev) => {
          const newPosts = [...prev, ...result!.posts];
          allPostsRef.current = newPosts;
          return newPosts;
        });
        setHasMore(result.hasMore);
        hasMoreRef.current = result.hasMore;
        setOffset(nextOffset + result.posts.length);
      } else {
        setHasMore(false);
        hasMoreRef.current = false;
      }
    }
    
    // Cleanup - always reset loading state
    setIsLoadingMore(false);
    isLoadingMoreRef.current = false;
  }, [userId]);

  const handleScrollWithPagination = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
  }, [handleScroll]);

  const handleLike = useCallback(async (post: SocialPost) => {
    if (!userId) {
      // User not logged in - could show alert here
      return;
    }
    
    // Get current state (from optimistic update if exists, otherwise from post)
    const optimistic = optimisticLikes.get(post.id);
    const currentIsLiked = optimistic?.isLiked ?? post.isLiked ?? false;
    const currentLikes = optimistic?.likes ?? post.likes ?? 0;
    const newIsLiked = !currentIsLiked;
    const newLikes = newIsLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

    // Optimistically update UI immediately
    setOptimisticLikes((prev) => {
      const newMap = new Map(prev);
      newMap.set(post.id, { isLiked: newIsLiked, likes: newLikes });
      return newMap;
    });

    try {
      await toggleLikePost(post.id, userId);
      // On success, remove from optimistic updates after a short delay
      // This allows the database hook to sync first
      setTimeout(() => {
        setOptimisticLikes((prev) => {
          const newMap = new Map(prev);
          newMap.delete(post.id);
          return newMap;
        });
      }, 100);
    } catch (error) {
      console.error('Error toggling like on post:', error);
      // Revert optimistic update on error
      setOptimisticLikes((prev) => {
        const newMap = new Map(prev);
        newMap.delete(post.id);
        return newMap;
      });
    }
  }, [userId, optimisticLikes]);

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

  const renderPost = useCallback(({ item: post }: { item: SocialPost }) => {
    const isCurrentUser = post.userId === userId || post.userId === profile.id;
    return (
      <View style={styles.postContainer}>
        <PostCard
          post={post}
          isCurrentUser={isCurrentUser}
          onLike={() => handleLike(post)}
          formatTimeAgo={formatTimeAgo}
          getPostIcon={getPostIcon}
        />
      </View>
    );
  }, [userId, profile.id, handleLike, formatTimeAgo, getPostIcon, styles]);

  const renderHeader = useCallback(() => (
    <>
      <CommunityHeader />
      <CommunityStatsRow profile={profile} />
      <ChallengesSection />
      <View style={styles.activityFeedHeader}>
        <Users size={20} color={colors.primary} />
        <Text style={styles.activityFeedTitle}>Activity Feed</Text>
      </View>
    </>
  ), [profile, colors.primary, styles]);

  const renderEmpty = useCallback(() => {
    if (postsLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.emptyText}>Loading posts...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts yet. Be the first to share your progress! 💪</Text>
      </View>
    );
  }, [postsLoading, colors.primary, styles]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore, colors.primary, styles]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBarBlurComponent />
      <LegendList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onScroll={handleScrollWithPagination}
        scrollEventThrottle={16}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      />
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  activityFeedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  activityFeedTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  postContainer: {
    paddingHorizontal: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footerLoader: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
