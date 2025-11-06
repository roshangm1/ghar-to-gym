import { db, id } from './instant';
import { SocialPost } from '@/types';

/**
 * Hook to fetch all social posts from InstantDB
 * Posts are sorted by creation date (newest first)
 * @param userId - Optional user ID to determine if posts are liked by the current user
 */
export function useSocialFeed(userId?: string | null) {
  const { data, isLoading } = db.useQuery({
    socialPosts: {},
  });

  const posts: SocialPost[] = (data?.socialPosts || [])
    .map((post: any) => {
      const likedBy = (post.likedBy || []) as string[];
      const isLiked = userId ? likedBy.includes(userId) : false;
      return {
        id: post.id,
        userId: post.userId,
        userName: post.userName,
        userAvatar: post.userAvatar,
        type: post.type as SocialPost['type'],
        content: post.content,
        timestamp: new Date(post.createdAt).toISOString(),
        likes: post.likes || 0,
        comments: post.comments || 0,
        data: post.data || undefined,
        isLiked,
      };
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    posts,
    isLoading,
  };
}

/**
 * Create a social post
 */
export async function createSocialPost(
  userId: string,
  userName: string,
  type: SocialPost['type'],
  content: string,
  data?: SocialPost['data'],
  userAvatar?: string
): Promise<string> {
  try {
    const postId = id();
      await db.transact([
      db.tx.socialPosts[postId].update({
        userId,
        userName,
        userAvatar,
        type,
        content,
        likes: 0,
        likedBy: [],
        comments: 0,
        data: data || null,
        createdAt: Date.now(),
      }),
      // Link the post to the user
      db.tx.users[userId].link({ socialPosts: postId }),
    ]);
    return postId;
  } catch (error) {
    console.error('Error creating social post:', error);
    throw error;
  }
}

/**
 * Like a social post (toggle like - increment/decrement likes count)
 * Only allows one like per user
 */
export async function toggleLikePost(postId: string, userId: string): Promise<void> {
  try {
    if (!userId) {
      throw new Error('User must be logged in to like posts');
    }

    // Get current post
    const { data } = await db.queryOnce({
      socialPosts: {
        $: {
          where: { id: postId as any },
        },
      },
    });

    const post = data?.socialPosts?.[0];
    if (!post) {
      throw new Error('Post not found');
    }

    const likedBy = (post.likedBy || []) as string[];
    const currentLikes = post.likes || 0;
    const isLiked = likedBy.includes(userId);

    let updatedLikedBy: string[];
    let updatedLikes: number;

    if (isLiked) {
      // Unlike: remove user from likedBy array and decrement likes
      updatedLikedBy = likedBy.filter((id) => id !== userId);
      updatedLikes = Math.max(0, currentLikes - 1);
    } else {
      // Like: add user to likedBy array and increment likes
      updatedLikedBy = [...likedBy, userId];
      updatedLikes = currentLikes + 1;
    }

    await db.transact([
      db.tx.socialPosts[postId].update({
        likes: updatedLikes,
        likedBy: updatedLikedBy,
      }),
    ]);
  } catch (error) {
    console.error('Error toggling like on social post:', error);
    throw error;
  }
}

/**
 * Like a social post (increment likes count)
 * @deprecated Use toggleLikePost instead
 */
export async function likeSocialPost(postId: string): Promise<void> {
  throw new Error('Use toggleLikePost with userId instead');
}

/**
 * Unlike a social post (decrement likes count)
 * @deprecated Use toggleLikePost instead
 */
export async function unlikeSocialPost(postId: string): Promise<void> {
  throw new Error('Use toggleLikePost with userId instead');
}

/**
 * Create a workout completion post
 */
export async function createWorkoutPost(
  userId: string,
  userName: string,
  workoutId: string,
  workoutTitle: string,
  userAvatar?: string
): Promise<string> {
  const content = `Just finished ${workoutTitle} workout! Feeling pumped 💪`;
  return createSocialPost(
    userId,
    userName,
    'workout',
    content,
    { workoutId },
    userAvatar
  );
}

/**
 * Create an achievement post
 */
export async function createAchievementPost(
  userId: string,
  userName: string,
  achievementTitle: string,
  icon: string,
  userAvatar?: string
): Promise<string> {
  const content = `Unlocked ${achievementTitle} achievement! ${icon}`;
  return createSocialPost(
    userId,
    userName,
    'achievement',
    content,
    { icon },
    userAvatar
  );
}

/**
 * Create a milestone post
 */
export async function createMilestonePost(
  userId: string,
  userName: string,
  milestoneText: string,
  icon: string,
  userAvatar?: string
): Promise<string> {
  return createSocialPost(
    userId,
    userName,
    'milestone',
    milestoneText,
    { icon },
    userAvatar
  );
}

/**
 * Create a challenge completion post
 */
export async function createChallengePost(
  userId: string,
  userName: string,
  challengeTitle: string,
  icon: string,
  userAvatar?: string
): Promise<string> {
  const content = `Completed ${challengeTitle}! ${icon}`;
  return createSocialPost(
    userId,
    userName,
    'challenge',
    content,
    { icon },
    userAvatar
  );
}

