import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/useAuth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { getWhiteLabelConfig } from '@/lib/whitelabel-runtime';

export default function AuthScreen() {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const { sendCode, verifyCode, pendingEmail, isLoading, logout } = useAuth();
  const whiteLabelConfig = getWhiteLabelConfig();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'login' | 'code'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const styles = createStyles(colors, insets);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setIsSubmitting(true);
      await sendCode(email.trim());
      setStep('code');
    } catch (error) {
      Alert.alert('Error', 'Failed to send code. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    try {
      setIsSubmitting(true);
      const isValid = await verifyCode(code.trim());
      
      if (isValid) {
        Alert.alert(
          'Success! 🎉',
          'You are now logged in.',
          [
            {
              text: 'Continue',
              onPress: () => {
                router.replace('/(tabs)');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify code. Please try again.');
      setCode('');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep('login');
    setCode('');
    logout();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>{whiteLabelConfig.branding.welcomeTitle}</Text>
          <Text style={styles.subtitle}>
            {step === 'login'
              ? 'Enter your email to get started'
              : `We sent a code to ${pendingEmail || email}`}
          </Text>
        </View>

        {step === 'login' ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSubmitting}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.buttonText}>Send Magic Code</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.info}>
              💡 You can browse workouts without logging in, but you need to sign in to track your progress and complete workouts.
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter 6-digit code</Text>
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor={colors.textSecondary}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                editable={!isSubmitting}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.buttonText}>Verify & Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={handleBack}
              disabled={isSubmitting}
            >
              <Text style={styles.linkText}>← Back to email</Text>
            </TouchableOpacity>

            <Text style={styles.info}>
              📧 Check your email (or console logs) for the magic code. It expires in 10 minutes.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.skipText}>Continue without logging in</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    scrollContent: {
      flexGrow: 1,
      paddingTop: insets.top + 40,
      paddingBottom: insets.bottom + 40,
      paddingHorizontal: 24,
    },
    header: {
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: colors.text,
      marginBottom: 12,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    form: {
      flex: 1,
    },
    inputGroup: {
      marginBottom: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      minHeight: 52,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.background,
    },
    linkButton: {
      marginTop: 16,
      alignItems: 'center',
    },
    linkText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600' as const,
    },
    info: {
      marginTop: 24,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
      textAlign: 'center',
    },
    skipButton: {
      marginTop: 32,
      alignItems: 'center',
      paddingVertical: 12,
    },
    skipText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500' as const,
    },
  });

