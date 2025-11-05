import { router } from 'expo-router';
import { Target } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export function GoalsCard() {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={styles.goalsCard}
      onPress={() => router.push('/goals')}
      activeOpacity={0.8}
    >
      <View style={styles.goalsCardLeft}>
        <View style={styles.goalsIcon}>
          <Target size={24} color={colors.background} />
        </View>
        <View>
          <Text style={styles.goalsCardTitle}>Goal Packages</Text>
          <Text style={styles.goalsCardSubtitle}>Weight loss, muscle gain & more</Text>
        </View>
      </View>
      <Text style={styles.goalsCardArrow}>→</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  goalsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
  },
  goalsCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  goalsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalsCardTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.background,
    marginBottom: 2,
  },
  goalsCardSubtitle: {
    fontSize: 13,
    color: colors.background,
    opacity: 0.9,
  },
  goalsCardArrow: {
    fontSize: 28,
    color: colors.background,
    fontWeight: '300' as const,
  },
});

