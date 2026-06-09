import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radii, layout } from '../../../theme';

function SkeletonItem() {
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  const size = layout.cardImageSize;

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
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  accentBar: { width: 4, backgroundColor: colors.surfaceDeep },
  image: { backgroundColor: colors.surfaceDeep },
  lines: { flex: 1, padding: spacing.md, justifyContent: 'center', gap: spacing.sm },
  line1: { height: 14, backgroundColor: colors.surfaceDeep, borderRadius: radii.sm, width: '65%' },
  line2: { height: 11, backgroundColor: colors.surfaceDeep, borderRadius: radii.sm, width: '40%' },
  divider: { height: 1, backgroundColor: colors.border },
  line3: { height: 10, backgroundColor: colors.surfaceDeep, borderRadius: radii.sm, width: '30%' },
  line4: { height: 11, backgroundColor: colors.surfaceDeep, borderRadius: radii.sm, width: '70%' },
});
