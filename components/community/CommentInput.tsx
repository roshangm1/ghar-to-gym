import { useThemeColor } from '@/hooks/useThemeColor';
import { Send } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

 

  const handleSubmit = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || isSubmitting || disabled) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed);
      setCommentText('');
      setIsSubmitting(false);
    } catch (error) {
      // Error handling is done in parent component
      console.error('Error in CommentInput:', error);
      setIsSubmitting(false);
    } 
  };

  const isDisabled = !commentText.trim() || isSubmitting || disabled;

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const createStyles = (
  colors: ReturnType<typeof useThemeColor>,
  insets: ReturnType<typeof useSafeAreaInsets>
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
      paddingBottom: insets.bottom,
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

