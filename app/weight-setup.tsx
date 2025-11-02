import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { useApp } from '@/contexts/AppContext';

export default function WeightSetupModal() {
  const { profile, updateWeight } = useApp();
  const colors = useThemeColor();
  const styles = createStyles(colors);
  const [currentWeight, setCurrentWeight] = useState(
    profile.weight?.current?.toString() || ''
  );
  const [targetWeight, setTargetWeight] = useState(
    profile.weight?.target?.toString() || ''
  );
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(
    profile.weight?.unit || 'kg'
  );

  const handleWeightSave = () => {
    const current = parseFloat(currentWeight);
    const target = parseFloat(targetWeight);
    
    if (isNaN(current) || isNaN(target) || current <= 0 || target <= 0) {
      alert('Please enter valid weight values');
      return;
    }
    
    Keyboard.dismiss();
    updateWeight(current, target, weightUnit);
    router.back();
    
  };

  const handleClose = () => {
    Keyboard.dismiss();
    router.back();
  };

  return (
   
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
      >
        <View style={styles.illustration}>
          <Text style={styles.illustrationEmoji}>⚖️</Text>
        </View>

        <Text style={styles.subtitle}>
          Set your current and target weight to get personalized fitness program
          recommendations
        </Text>

        <View style={styles.unitSelector}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              weightUnit === 'kg' && styles.unitButtonActive,
            ]}
            onPress={() => setWeightUnit('kg')}
          >
            <Text
              style={[
                styles.unitButtonText,
                weightUnit === 'kg' && styles.unitButtonTextActive,
              ]}
            >
              Kilograms (kg)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.unitButton,
              weightUnit === 'lbs' && styles.unitButtonActive,
            ]}
            onPress={() => setWeightUnit('lbs')}
          >
            <Text
              style={[
                styles.unitButtonText,
                weightUnit === 'lbs' && styles.unitButtonTextActive,
              ]}
            >
              Pounds (lbs)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current Weight</Text>
          <TextInput
            style={styles.input}
            value={currentWeight}
            onChangeText={setCurrentWeight}
            keyboardType="decimal-pad"
            placeholder={`Enter weight in ${weightUnit}`}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Target Weight</Text>
          <TextInput
            style={styles.input}
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="decimal-pad"
            placeholder={`Enter target in ${weightUnit}`}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {currentWeight && targetWeight && !isNaN(parseFloat(currentWeight)) && !isNaN(parseFloat(targetWeight)) && (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Your Goal</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewValue}>
                {parseFloat(currentWeight).toFixed(1)} {weightUnit}
              </Text>
              <Text style={styles.previewArrow}>→</Text>
              <Text style={styles.previewValue}>
                {parseFloat(targetWeight).toFixed(1)} {weightUnit}
              </Text>
            </View>
            <Text style={styles.previewDiff}>
              {parseFloat(targetWeight) - parseFloat(currentWeight) > 0 ? '+' : ''}
              {(parseFloat(targetWeight) - parseFloat(currentWeight)).toFixed(1)} {weightUnit}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleWeightSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Weight Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    // flex: 1,
  },
  content: {
    padding: 24,
  },
  illustration: {
    // alignItems: 'center',
    marginBottom: 24,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
  unitButtonActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    textAlign: 'center',
  },
  unitButtonTextActive: {
    color: colors.primary,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 17,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  preview: {
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  previewLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  previewValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  previewArrow: {
    fontSize: 20,
    color: colors.primary,
  },
  previewDiff: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.background,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
});

