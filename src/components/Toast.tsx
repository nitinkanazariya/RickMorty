import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { StarIcon } from 'react-native-heroicons/solid';
import { StarIcon as StarIconOutline } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { layout, spacing } from '../theme';
import { styles } from './Toast.style';

type Props = {
  message: string;
  visible: boolean;
  type: 'add' | 'remove';
};

export default function Toast({ message, visible, type }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 90, friction: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 80, duration: 220, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const iconColor = type === 'add' ? colors.accent : colors.textMuted;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          bottom: insets.bottom + layout.tabBarHeight + spacing.lg,
          backgroundColor: colors.surfaceElevated,
          borderColor: type === 'add' ? colors.accent : colors.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {type === 'add'
        ? <StarIcon size={16} color={iconColor} />
        : <StarIconOutline size={16} color={iconColor} />}
      <Text style={[styles.text, { color: colors.textPrimary }]}>{message}</Text>
    </Animated.View>
  );
}
