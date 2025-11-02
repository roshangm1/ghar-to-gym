import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { seedWorkouts, clearWorkouts } from '@/lib/seed-workouts';
import { seedNutrition, clearNutrition } from '@/lib/seed-nutrition';

/**
 * Seed Data Screen
 * 
 * This screen provides buttons to seed or clear workout data in InstantDB.
 * Use this for initial setup or to reset your database.
 * 
 * To access this screen, add it to your navigation or navigate to it via:
 * router.push('/seed-data')
 */
export default function SeedDataScreen() {
  const [isSeedingWorkouts, setIsSeedingWorkouts] = useState(false);
  const [isSeedingNutrition, setIsSeedingNutrition] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedWorkouts = async () => {
    try {
      setIsSeedingWorkouts(true);
      setMessage('Seeding workouts...');
      
      const result = await seedWorkouts();
      
      setMessage(`✅ Successfully seeded ${result.count} workouts!`);
      
      Alert.alert(
        'Success!',
        `${result.count} workouts have been added to your database.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Error: ${errorMessage}`);
      Alert.alert('Error', `Failed to seed workouts: ${errorMessage}`);
    } finally {
      setIsSeedingWorkouts(false);
    }
  };

  const handleSeedNutrition = async () => {
    try {
      setIsSeedingNutrition(true);
      setMessage('Seeding nutrition tips...');
      
      const result = await seedNutrition();
      
      setMessage(`✅ Successfully seeded ${result.count} nutrition tips!`);
      
      Alert.alert(
        'Success!',
        `${result.count} nutrition tips have been added to your database.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Error: ${errorMessage}`);
      Alert.alert('Error', `Failed to seed nutrition: ${errorMessage}`);
    } finally {
      setIsSeedingNutrition(false);
    }
  };

  const handleSeedAll = async () => {
    try {
      setIsSeedingWorkouts(true);
      setIsSeedingNutrition(true);
      setMessage('Seeding all data...');
      
      const [workoutResult, nutritionResult] = await Promise.all([
        seedWorkouts(),
        seedNutrition(),
      ]);
      
      setMessage(
        `✅ Successfully seeded ${workoutResult.count} workouts and ${nutritionResult.count} nutrition tips!`
      );
      
      Alert.alert(
        'Success!',
        `Database seeded successfully!\n\n${workoutResult.count} workouts\n${nutritionResult.count} nutrition tips`,
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Error: ${errorMessage}`);
      Alert.alert('Error', `Failed to seed data: ${errorMessage}`);
    } finally {
      setIsSeedingWorkouts(false);
      setIsSeedingNutrition(false);
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Clear All Data?',
      'This will delete all workouts, exercises, and nutrition tips from the database. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearing(true);
              setMessage('Clearing all data...');
              
              const [workoutResult, nutritionResult] = await Promise.all([
                clearWorkouts(),
                clearNutrition(),
              ]);
              
              setMessage(
                `✅ Successfully cleared ${workoutResult.deleted + nutritionResult.deleted} items!`
              );
              
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              setMessage(`❌ Error: ${errorMessage}`);
              Alert.alert('Error', `Failed to clear data: ${errorMessage}`);
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Database Seeding</Text>
        <Text style={styles.subtitle}>
          Initialize your InstantDB database with example workout data
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ About This Tool</Text>
          <Text style={styles.infoText}>
            • Use "Seed All Data" to populate everything at once{'\n'}
            • Or seed workouts and nutrition separately{'\n'}
            • Only run the seed functions once{'\n'}
            • Use "Clear Data" if you need to reset and re-seed{'\n'}
            • Make sure you've set your APP_ID in lib/instant.ts
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            styles.seedAllButton,
            (isSeedingWorkouts || isSeedingNutrition || isClearing) && styles.buttonDisabled,
          ]}
          onPress={handleSeedAll}
          disabled={isSeedingWorkouts || isSeedingNutrition || isClearing}
        >
          <Text style={styles.buttonText}>
            {isSeedingWorkouts || isSeedingNutrition
              ? '⏳ Seeding All...'
              : '🌱 Seed All Data (Recommended)'}
          </Text>
        </TouchableOpacity>

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>Or seed individually</Text>
          <View style={styles.separatorLine} />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            styles.seedButton,
            (isSeedingWorkouts || isClearing) && styles.buttonDisabled,
          ]}
          onPress={handleSeedWorkouts}
          disabled={isSeedingWorkouts || isClearing}
        >
          <Text style={styles.buttonText}>
            {isSeedingWorkouts ? '⏳ Seeding...' : '💪 Seed Workouts Only'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.seedButton,
            (isSeedingNutrition || isClearing) && styles.buttonDisabled,
          ]}
          onPress={handleSeedNutrition}
          disabled={isSeedingNutrition || isClearing}
        >
          <Text style={styles.buttonText}>
            {isSeedingNutrition ? '⏳ Seeding...' : '🍱 Seed Nutrition Only'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton, isClearing && styles.buttonDisabled]}
          onPress={handleClearAll}
          disabled={isSeedingWorkouts || isSeedingNutrition || isClearing}
        >
          <Text style={styles.buttonText}>
            {isClearing ? '⏳ Clearing...' : '🗑️ Clear All Data'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
          disabled={isSeedingWorkouts || isSeedingNutrition || isClearing}
        >
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    gap: 16,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 22,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedAllButton: {
    backgroundColor: '#2196f3',
  },
  seedButton: {
    backgroundColor: '#4caf50',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  backButton: {
    backgroundColor: '#757575',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500' as const,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  messageBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

