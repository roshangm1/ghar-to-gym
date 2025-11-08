import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, Clock } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { SocialPost } from '@/types';

interface PostCardProps {
  post: SocialPost;
  isCurrentUser: boolean;
  onLike: () => void;
  formatTimeAgo: (timestamp: string) => string;
  getPostIcon: (post: SocialPost) => string;
}

export function PostCard({ 
  post, 
  isCurrentUser, 
  onLike, 
  formatTimeAgo, 
  getPostIcon,
}: PostCardProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const router = useRouter();

  const handleOpenComments = () => {
    router.push(`/post/${post.id}/comments`);
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <View style={[
            styles.avatar,
            isCurrentUser && styles.avatarHighlight,
          ]}>
            <Text style={styles.avatarText}>
              {post.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.postAuthorInfo}>
            <Text style={[
              styles.postAuthorName,
              isCurrentUser && styles.postAuthorNameHighlight,
            ]}>
              {post.userName}
            </Text>
            <View style={styles.postMeta}>
              <Clock size={12} color={colors.textSecondary} />
              <Text style={styles.postTime}>
                {formatTimeAgo(post.timestamp)}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.postTypeIcon}>{getPostIcon(post)}</Text>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.7}
          onPress={onLike}
        >
          <View style={post.isLiked ? styles.heartContainerLiked : styles.heartContainer}>
            <Heart 
              size={18} 
              color={post.isLiked ? colors.primary : colors.textSecondary}
            />
          </View>
          <Text style={[
            styles.actionText,
            post.isLiked && { color: colors.primary }
          ]}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.7}
          onPress={handleOpenComments}
        >
          <MessageCircle size={18} color={colors.textSecondary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  postCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHighlight: {
    backgroundColor: colors.primary + '20',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  postAuthorNameHighlight: {
    color: colors.primary,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  postTypeIcon: {
    fontSize: 24,
  },
  postContent: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 21,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 50,
  },
  heartContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartContainerLiked: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    backgroundColor: colors.primary + '15',
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500' as const,
    minWidth: 24,
    textAlign: 'left',
  },
});

