import React, { useRef } from 'react';
import { View, Animated, NativeScrollEvent, NativeSyntheticEvent, useColorScheme, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StatusBarBlurProps {
  scrollY: Animated.Value;
  scrollEventThrottle?: number;
}

export function StatusBarBlur({ scrollY, scrollEventThrottle = 16 }: StatusBarBlurProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const blurOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.statusBarBlur,
        {
          opacity: blurOpacity,
          height: insets.top,
        },
      ]}
      pointerEvents="none"
    >
      <BlurView intensity={30} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.blurContent} />
    </Animated.View>
  );
}

export function useStatusBarBlur() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.setValue(event.nativeEvent.contentOffset.y);
  };

  return {
    scrollY,
    handleScroll,
    StatusBarBlurComponent: () => <StatusBarBlur scrollY={scrollY} />,
  };
}

const styles = StyleSheet.create({
  statusBarBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    // overflow: 'hidden',
  },
  blurContent: {
    flex: 1,
  },
});

