import { db, id } from './instant';
import { SocialPost, Comment } from '@/types';

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

/**
 * Hook to fetch comments for a specific post
 * Comments are sorted by creation date (oldest first)
 * Returns empty array if postId is empty
 */
export function useComments(postId: string) {
  const { data, isLoading } = db.useQuery(
    postId
      ? {
          comments: {
            $: {
              where: { postId },
            },
          },
        }
      : { comments: {} }
  );

  // If postId is empty, return empty array
  if (!postId) {
    return {
      comments: [],
      isLoading: false,
    };
  }

  const comments: Comment[] = (data?.comments || [])
    .map((comment: any) => ({
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      userName: comment.userName,
      userAvatar: comment.userAvatar,
      content: comment.content,
      timestamp: new Date(comment.createdAt).toISOString(),
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return {
    comments,
    isLoading,
  };
}

/**
 * Create a comment on a social post
 */
export async function createComment(
  postId: string,
  userId: string,
  userName: string,
  content: string,
  userAvatar?: string
): Promise<string> {
  try {
    if (!userId) {
      throw new Error('User must be logged in to comment');
    }

    if (!content.trim()) {
      throw new Error('Comment cannot be empty');
    }

    // Get current post to update comment count
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

    // Use the actual post entity ID from the query result
    const postEntityId = post.id;
    const currentComments = post.comments || 0;
    const commentId = id();

    // Check if user exists in users table before linking
    const { data: userData } = await db.queryOnce({
      users: {
        $: {
          where: { id: userId as any },
        },
      },
    });

    const userExists = userData?.users && userData.users.length > 0;

    // Build transaction array
    const transactions: any[] = [
      // Create the comment
      db.tx.comments[commentId].update({
        postId: postEntityId,
        userId,
        userName,
        userAvatar: userAvatar || null,
        content: content.trim(),
        createdAt: Date.now(),
      }),
      // Link comment to post (use entity ID)
      db.tx.socialPosts[postEntityId].link({ comments: commentId }),
      // Update comment count on post (use entity ID)
      db.tx.socialPosts[postEntityId].update({
        comments: currentComments + 1,
      }),
    ];

    // Only link to user if user exists in users table
    if (userExists) {
      transactions.push(db.tx.users[userId].link({ comments: commentId }));
    }

    await db.transact(transactions);

    return commentId;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string, userId: string): Promise<void> {
  try {
    if (!userId) {
      throw new Error('User must be logged in to delete comments');
    }

    // Get the comment to verify ownership and get postId
    const { data } = await db.queryOnce({
      comments: {
        $: {
          where: { id: commentId as any },
        },
      },
    });

    const comment = data?.comments?.[0];
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Only allow users to delete their own comments
    if (comment.userId !== userId) {
      throw new Error('You can only delete your own comments');
    }

    // Get the post to update comment count
    const { data: postData } = await db.queryOnce({
      socialPosts: {
        $: {
          where: { id: comment.postId as any },
        },
      },
    });

    const post = postData?.socialPosts?.[0];
    const currentComments = post?.comments || 0;

    await db.transact([
      // Delete the comment
      db.tx.comments[commentId].delete(),
      // Update comment count on post
      db.tx.socialPosts[comment.postId].update({
        comments: Math.max(0, currentComments - 1),
      }),
    ]);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

