import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radii, layout } from '../../../theme';

function SkeletonItem() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  const size = layout.cardImageSize;

  return (
    <Animated.View style={[styles.card, { opacity, height: size }]}>
      <View style={[styles.image, { width: size, height: size }]} />
      <View style={styles.lines}>
        <View style={styles.line1} />
        <View style={styles.line2} />
        <View style={styles.line3} />
      </View>
    </Animated.View>
  );
}

export default function CharacterSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: layout.headerHeight + 8, paddingHorizontal: spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  image: { backgroundColor: colors.surfaceDeep },
  lines: { flex: 1, padding: spacing.md, justifyContent: 'center', gap: spacing.sm },
  line1: { height: 14, backgroundColor: colors.surfaceDeep, borderRadius: radii.sm, width: '70%' },
  line2: { height: 11, backgroundColor: colors.surfaceDeep, borderRadius: radii.sm, width: '50%' },
  line3: { height: 11, backgroundColor: colors.surfaceDeep, borderRadius: radii.sm, width: '60%' },
});
