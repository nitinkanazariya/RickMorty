import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { layout } from '../../../theme';
import { makeStyles } from './CharacterSkeleton.style';

function SkeletonItem() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const opacity = useRef(new Animated.Value(0.2)).current;
  const size = layout.cardImageSize;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.accentBar} />
      <View style={[styles.image, { width: size, height: size }]} />
      <View style={styles.lines}>
        <View style={styles.line1} />
        <View style={styles.line2} />
        <View style={styles.divider} />
        <View style={styles.line3} />
        <View style={styles.line4} />
      </View>
    </Animated.View>
  );
}

export default function CharacterSkeleton() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)}
    </View>
  );
}
