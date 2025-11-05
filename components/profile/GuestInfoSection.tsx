import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface GuestInfoSectionProps {
  title: string;
  items: Array<{ bullet: string; text: string }>;
}

export function GuestInfoSection({ title, items }: GuestInfoSectionProps) {
  const colors = useThemeColor();
  const styles = createStyles(colors);

  return (
    <View style={styles.guestInfoSection}>
      <Text style={styles.guestInfoTitle}>{title}</Text>
      <View style={styles.guestInfoList}>
        {items.map((item, index) => (
          <View key={index} style={styles.guestInfoItem}>
            <Text style={styles.guestInfoBullet}>{item.bullet}</Text>
            <Text style={styles.guestInfoText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useThemeColor>) => StyleSheet.create({
  guestInfoSection: {
    padding: 12,
    marginTop: 8,
  },
  guestInfoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  guestInfoList: {
    gap: 12,
  },
  guestInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
  },
  guestInfoBullet: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  guestInfoText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '500' as const,
  },
});

