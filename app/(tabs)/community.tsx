import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { useSocialFeed, toggleLikePost } from '@/lib/useSocialFeed';
import { SocialPost } from '@/types';
import { useStatusBarBlur } from '@/components/StatusBarBlur';
import { useUserProfile } from '@/lib/useUserData';
import {
  CommunityHeader,
  CommunityStatsRow,
  ActivityFeedSection,
  ChallengesSection,
} from '@/components/community';

export default function CommunityScreen() {
  const { profile } = useApp();
  const { userId } = useUserProfile();
  const { posts: dbPosts, isLoading: postsLoading } = useSocialFeed(userId);
  const insets = useSafeAreaInsets();
  const { handleScroll, StatusBarBlurComponent } = useStatusBarBlur();
  const [optimisticLikes, setOptimisticLikes] = useState<Map<string, { isLiked: boolean; likes: number }>>(new Map());

  // Merge database posts with optimistic updates
  const posts = useMemo(() => {
    return dbPosts.map((post) => {
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
  }, [dbPosts, optimisticLikes]);

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

  return (
    <View style={{ flex: 1 }}>
      <StatusBarBlurComponent />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom  }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <CommunityHeader />
        <CommunityStatsRow profile={profile} />
        <ActivityFeedSection
          posts={posts}
          isLoading={postsLoading}
          currentUserId={userId || profile.id}
          onLike={handleLike}
        />
        <ChallengesSection />
      </ScrollView>
    </View>
  );
}
