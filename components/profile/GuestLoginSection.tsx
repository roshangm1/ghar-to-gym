import { router } from 'expo-router';
import { LogIn } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export function GuestLoginSection() {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.loginSection}>
      <View style={styles.loginCard}>
        <View style={styles.loginIcon}>
          <LogIn size={32} color={colors.primary} />
        </View>
        <Text style={styles.loginTitle}>Sign In to Unlock</Text>
        <Text style={styles.loginDescription}>
          Log in or create an account to track your workouts, build streaks, unlock achievements, and sync your progress across devices.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/auth')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginButtonText}>Sign In / Register</Text>
        </TouchableOpacity>
        <Text style={styles.loginSubtext}>
          We&apos;ll send you a magic code to your email
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  loginSection: {
    padding: 12,
  },
  loginCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  loginIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text,
    textAlign: 'center',
  },
  loginDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.background,
  },
  loginSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});

