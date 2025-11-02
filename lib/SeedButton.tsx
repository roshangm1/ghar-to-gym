import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

/**
 * Quick button component to navigate to the seed data screen
 * 
 * Usage:
 * import { SeedButton } from '@/lib/SeedButton';
 * 
 * // In your component:
 * <SeedButton />
 */
export function SeedButton() {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push('/seed-data')}
    >
      <Text style={styles.text}>🌱 Setup Database</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

