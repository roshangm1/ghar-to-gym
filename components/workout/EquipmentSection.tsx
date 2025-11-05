import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface EquipmentSectionProps {
  equipment: string[];
}

export function EquipmentSection({ equipment }: EquipmentSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  if (equipment.length === 0) {
    return (
      <View style={styles.noEquipmentBanner}>
        <Text style={styles.noEquipmentText}>
          ✓ No equipment needed - Perfect for home workouts!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.equipmentSection}>
      <Text style={styles.sectionTitle}>Equipment Needed</Text>
      <View style={styles.equipmentList}>
        {equipment.map((item: string, index: number) => (
          <View key={index} style={styles.equipmentItem}>
            <Text style={styles.equipmentText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  equipmentSection: {
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentItem: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  equipmentText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500' as const,
  },
  noEquipmentBanner: {
    backgroundColor: colors.success + '15',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 12,
  },
  noEquipmentText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.success,
    textAlign: 'center',
  },
});

