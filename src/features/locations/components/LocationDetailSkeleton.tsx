import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii, layout } from '../../../theme';

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background, paddingHorizontal: spacing.lg },
    backLine: { height: 20, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: 80, marginBottom: spacing.lg },
    card: { backgroundColor: c.surface, borderRadius: radii.xl, padding: spacing.xl, marginBottom: spacing.xl, gap: spacing.sm },
    cardName: { height: 24, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '75%' },
    cardType: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '40%' },
    cardDim: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '60%' },
    cardRes: { height: 12, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '30%', marginTop: spacing.xs },
    sectionTitle: { height: 18, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '40%', marginBottom: spacing.lg },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    residentItem: { alignItems: 'center', gap: spacing.sm, width: `${Math.floor(100 / layout.residentColumns)}%` },
    circle: { backgroundColor: c.surfaceDeep },
    resName: { height: 10, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: 48 },
  });
}

export default function LocationDetailSkeleton({ topInset }: { topInset: number }) {
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

  const cols = layout.residentColumns;
  const avatarSize = cols >= 5 ? 64 : 80;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.backLine, { marginTop: topInset + spacing.sm }]} />
      <View style={styles.card}>
        <View style={styles.cardName} />
        <View style={styles.cardType} />
        <View style={styles.cardDim} />
        <View style={styles.cardRes} />
      </View>
      <View style={styles.sectionTitle} />
      <View style={styles.grid}>
        {Array.from({ length: cols * 2 }).map((_, i) => (
          <View key={i} style={styles.residentItem}>
            <View style={[styles.circle, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} />
            <View style={styles.resName} />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
