import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { spacing, radii } from '../../../theme';

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { paddingBottom: spacing.xxxl },
    favBtn: { alignSelf: 'center', width: 110, height: 38, backgroundColor: c.surfaceDeep, borderRadius: radii.full, marginBottom: spacing.xl },
    infoCard: {
      marginHorizontal: spacing.lg,
      backgroundColor: c.surface,
      borderRadius: radii.xl,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      gap: spacing.md,
    },
    name: { height: 22, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '65%' },
    status: { height: 14, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '30%' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.sm },
    gridItem: { width: '45%', gap: 6 },
    label: { height: 10, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '50%' },
    value: { height: 13, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '80%' },
    episodesSection: { paddingHorizontal: spacing.lg, gap: spacing.md },
    sectionTitle: { height: 18, backgroundColor: c.surfaceDeep, borderRadius: radii.sm, width: '45%' },
    chipsRow: { flexDirection: 'row', gap: 10 },
    chip: { width: 110, height: 34, backgroundColor: c.surfaceDeep, borderRadius: radii.md },
  });
}

export default function CharacterDetailSkeleton() {
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
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.favBtn} />
      <View style={styles.infoCard}>
        <View style={styles.name} />
        <View style={styles.status} />
        <View style={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={styles.gridItem}>
              <View style={styles.label} />
              <View style={styles.value} />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.episodesSection}>
        <View style={styles.sectionTitle} />
        <View style={styles.chipsRow}>
          {Array.from({ length: 4 }).map((_, i) => <View key={i} style={styles.chip} />)}
        </View>
      </View>
    </Animated.View>
  );
}
