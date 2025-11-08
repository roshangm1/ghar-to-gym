import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useAnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { Send } from 'lucide-react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CommentInputProps {
  onSubmit: (text: string) => Promise<void>;
  disabled?: boolean;
}

export function CommentInput({ onSubmit, disabled = false }: CommentInputProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { height } = useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -height.value }],
    };
  });

  const handleSubmit = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || isSubmitting || disabled) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed);
      setCommentText('');
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error in CommentInput:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !commentText.trim() || isSubmitting || disabled;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TextInput
        style={styles.input}
        placeholder="Add a comment..."
        placeholderTextColor={colors.textSecondary}
        value={commentText}
        onChangeText={setCommentText}
        multiline
        maxLength={500}
        editable={!isSubmitting && !disabled}
      />
      <TouchableOpacity
        style={[styles.sendButton, isDisabled && styles.sendButtonDisabled]}
        onPress={handleSubmit}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={colors.background} />
        ) : (
          <Send size={20} color={colors.background} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (
  colors: ReturnType<typeof useThemeColor>,
  insets: ReturnType<typeof useSafeAreaInsets>
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: insets.bottom + 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 22,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
  });

