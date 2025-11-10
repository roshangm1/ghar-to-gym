import {
  ChallengesSection,
  CommunityHeader,
  CommunityStatsRow,
  PostCard,
} from '@/components/community';
import { useStatusBarBlur } from '@/components/StatusBarBlur';
import { useApp } from '@/contexts/AppContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { loadMoreSocialPosts, toggleLikePost, useSocialFeed } from '@/lib/useSocialFeed';
import { useUserProfile } from '@/lib/useUserData';
import { SocialPost } from '@/types';
import { LegendList } from '@legendapp/list';
import { Users } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';

const POSTS_PER_PAGE = 10;
interface CommunityHeaderSectionProps {
  userId: string;
  points: number;
  streak: number;
}


export function CommunityHeaderSection({ userId, points, streak }: CommunityHeaderSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <>
      <CommunityHeader />
      <CommunityStatsRow userId={userId} points={points} streak={streak} />
      <ChallengesSection />
      <View style={styles.activityFeedHeader}>
        <Users size={20} color={colors.primary} />
        <Text style={styles.activityFeedTitle}>Activity Feed</Text>
      </View>
    </>
  );
}


export default function CommunityScreen() {
  const { profile } = useApp();
  const { userId } = useUserProfile();
  const { posts: dbPosts, isLoading: postsLoading, hasMore: dbHasMore } = useSocialFeed(userId, POSTS_PER_PAGE, 0);
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const { handleScroll, StatusBarBlurComponent } = useStatusBarBlur();
  
  const [loadedPosts, setLoadedPosts] = useState<SocialPost[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreLoaded, setHasMoreLoaded] = useState(true);
  const isLoadingMoreRef = useRef(false);

  const allPosts = postsLoading ? [] : [...dbPosts, ...loadedPosts];
  const hasMore = loadedPosts.length > 0 ? hasMoreLoaded : dbHasMore;
  const initialPostIds = dbPosts.map(p => p.id).join(',');
  const prevInitialPostIdsRef = useRef<string>('');
  
  useEffect(() => {
    if (!postsLoading && initialPostIds !== prevInitialPostIdsRef.current) {
      prevInitialPostIdsRef.current = initialPostIds;
      setLoadedPosts([]);
      setHasMoreLoaded(true);
    }
  }, [initialPostIds, postsLoading]);


  const handleLoadMore = async () => {
    if (isLoadingMoreRef.current || !hasMore || allPosts.length === 0) {
      return;
    }

    setIsLoadingMore(true);
    isLoadingMoreRef.current = true;
    
    const nextOffset = allPosts.length;
    
    let result: { posts: SocialPost[]; hasMore: boolean } | null = null;
    
    const loadPromise = loadMoreSocialPosts(userId, nextOffset, POSTS_PER_PAGE);
    
    result = await loadPromise.catch((error) => {
      console.error('Error loading more posts:', error);
      return null;
    });
    
    if (result !== null) {
      if (result.posts.length > 0) {
        setLoadedPosts((prev) => [...prev, ...result!.posts]);
        setHasMoreLoaded(result.hasMore);
      } else {
        setHasMoreLoaded(false);
      }
    }
    
    setIsLoadingMore(false);
    isLoadingMoreRef.current = false;
  };
  
  useEffect(() => {
    isLoadingMoreRef.current = isLoadingMore;
  }, [isLoadingMore]);

  const handleScrollWithPagination = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
  };

  const handleLike = async (post: SocialPost) => {
    if (!userId) {
      return;
    }
    
    try {
      toggleLikePost(post.id, userId);
    } catch (error) {
      console.error('Error toggling like on post:', error);
    }
  };

  
  const getPostIcon = (post: SocialPost) => {
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
  };

  const renderPost = ({ item: post }: { item: SocialPost }) => {
    const isCurrentUser = post.userId === userId || post.userId === profile.id;
    return (
      <View style={styles.postContainer}>
        <PostCard
          post={post}
          isCurrentUser={isCurrentUser}
          onLike={() => handleLike(post)}
          getPostIcon={getPostIcon}
        />
      </View>
    );
  }

  const renderHeader = () => (
    <CommunityHeaderSection 
      userId={profile.id} 
      points={profile.points} 
      streak={profile.workoutStreak} 
  />
  );

  const renderEmpty = () => {
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
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBarBlurComponent />
      <LegendList
        data={allPosts}
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
        contentContainerStyle={{ backgroundColor: colors.backgroundSecondary }}
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
