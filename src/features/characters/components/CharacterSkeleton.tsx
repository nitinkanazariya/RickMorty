import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii, layout } from '../../../theme';

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { paddingTop: layout.headerHeight + 8, paddingHorizontal: spacing.md },
    card: {
      flexDirection: 'row',
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: c.border,
    },
    accentBar: { width: 4, backgroundColor: c.surfaceDeep },
    image: { backgroundColor: c.surfaceDeep },
    lines: { flex: 1, padding: spacing.md, justifyContent: 'center', gap: spacing.sm },
    line1: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '65%' },
    line2: { height: 11, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '40%' },
    divider: { height: 1, backgroundColor: c.border },
    line3: { height: 10, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '30%' },
    line4: { height: 11, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '70%' },
  });
}

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
