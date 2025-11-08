import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { X } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useComments, createComment, deleteComment } from '@/lib/useSocialFeed';
import { useUserProfile } from '@/lib/useUserData';
import { useApp } from '@/contexts/AppContext';
import { CommentCard, CommentInput } from '@/components/community';

export default function CommentsScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColor();
  const styles = createStyles(colors, insets);
  const { profile } = useApp();
  const { userId, profile: userProfile } = useUserProfile();
  const { comments, isLoading } = useComments(postId);

  const formatTimeAgo = useCallback((timestamp: string) => {
    const now = new Date().getTime();
    const commentTime = new Date(timestamp).getTime();
    const diff = now - commentTime;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }, []);

  const handleSubmitComment = useCallback(async (text: string) => {
    if (!userId) {
      Alert.alert('Login Required', 'You must be logged in to comment on posts.');
      return;
    }

    // Extract computed values before try/catch for React Compiler optimization
    const userName = userProfile?.name || profile.name;
    const userAvatar = userProfile?.avatar || profile.avatar;

    try {
      await createComment(
        postId,
        userId,
        userName,
        text,
        userAvatar
      );
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to post comment. Please try again.');
      throw error; // Re-throw so CommentInput can handle it
    }
  }, [postId, userId, userProfile?.name, profile.name, userProfile?.avatar, profile.avatar]);

  const handleDeleteComment = async (commentId: string) => {
    if (!userId) {
      Alert.alert('Login Required', 'You must be logged in to delete comments.');
      return;
    }

    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteComment(commentId, userId);
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert('Error', 'Failed to delete comment. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comments</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={styles.keyboardView}
        contentContainerStyle={styles.commentsContent}
        showsVerticalScrollIndicator={false}
        bottomOffset={userId ? 80 : 0}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading comments...</Text>
          </View>
        ) : comments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No comments yet.</Text>
            <Text style={styles.emptySubtext}>Be the first to comment!</Text>
          </View>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              isCurrentUser={comment.userId === userId}
              onDelete={
                comment.userId === userId
                  ? () => handleDeleteComment(comment.id)
                  : undefined
              }
              formatTimeAgo={formatTimeAgo}
            />
          ))
        )}
      </KeyboardAwareScrollView>

      {userId && (
        <CommentInput onSubmit={handleSubmitComment} />
      )}
    </View>
  );
}

const createStyles = (
  colors: ReturnType<typeof useThemeColor>,
  insets: ReturnType<typeof useSafeAreaInsets>
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingTop: 12
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    keyboardView: {
      flex: 1,
    },
    commentsContent: {
      padding: 16,
      paddingBottom: 20,
    },
    loadingContainer: {
      padding: 32,
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    emptyContainer: {
      padding: 32,
      alignItems: 'center',
      gap: 8,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

