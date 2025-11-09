import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash2, Clock } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Comment } from '@/types';
import dayjs from 'dayjs';

interface CommentCardProps {
  comment: Comment;
  isCurrentUser: boolean;
  onDelete?: () => void;
}

export function CommentCard({ 
  comment, 
  isCurrentUser, 
  onDelete,
}: CommentCardProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.commentAuthor}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {comment.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.commentAuthorInfo}>
            <Text style={styles.commentAuthorName}>
              {comment.userName}
            </Text>
            <View style={styles.commentMeta}>
              <Clock size={10} color={colors.textSecondary} />
              <Text style={styles.commentTime}>
                {dayjs(comment.timestamp).fromNow()}
              </Text>
            </View>
          </View>
        </View>
        {isCurrentUser && onDelete && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Trash2 size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.commentContent}>{comment.content}</Text>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  commentCard: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.text,
  },
  commentAuthorInfo: {
    flex: 1,
  },
  commentAuthorName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 2,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
  },
  commentContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    paddingLeft: 36, // Align with author name
  },
});

