import { LogOut } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';
import { UserProfile } from '@/types';
import { useAuth } from '@/lib/useAuth';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const colors = useThemeColor();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? You can always sign back in to continue tracking your progress.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.profileHeader}>
      <Text style={styles.headerSubtitle}>Your Profile</Text>
      <View style={styles.profileNameContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>
      </View>
      <View style={styles.profileActions}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut size={18} color={colors.textSecondary} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>, insets: ReturnType<typeof useSafeAreaInsets>) => StyleSheet.create({
  profileHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: insets.top,
    paddingBottom: 24,
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileActions: {
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.background,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  profileEmail: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});

