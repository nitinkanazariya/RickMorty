import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii, layout } from '../../../theme';

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { paddingTop: layout.headerHeight + 8, paddingHorizontal: spacing.md },
    footerContainer: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
    card: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: c.surface, borderRadius: radii.md,
      marginBottom: spacing.sm, padding: spacing.md,
      borderWidth: 1.5, borderColor: c.border, gap: spacing.sm,
    },
    tag: { width: 52, height: 22, backgroundColor: c.surfaceDeep, borderRadius: radii.sm },
    lines: { flex: 1, gap: 8 },
    line1: { height: 13, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '70%' },
    line2: { height: 11, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '45%' },
    chevron: { width: 12, height: 12, backgroundColor: c.surfaceDeep, borderRadius: radii.sm },
  });
}

function SkeletonRow() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 850, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 850, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.tag} />
      <View style={styles.lines}>
        <View style={styles.line1} />
        <View style={styles.line2} />
      </View>
      <View style={styles.chevron} />
    </Animated.View>
  );
}

export default function EpisodeSkeleton({ footer = false }: { footer?: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const count = footer ? 2 : 6;
  return (
    <View style={footer ? styles.footerContainer : styles.container}>
      {Array.from({ length: count }).map((_, i) => <SkeletonRow key={i} />)}
    </View>
  );
}
