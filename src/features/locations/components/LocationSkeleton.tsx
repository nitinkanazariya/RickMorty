import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { layout } from '../../../theme';
import { makeStyles } from './LocationSkeleton.style';

function SkeletonCard() {
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
      <View style={styles.name} />
      <View style={styles.pill} />
      <View style={styles.dim} />
      <View style={styles.res} />
    </Animated.View>
  );
}

export default function LocationSkeleton({ footer = false }: { footer?: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const cols = layout.locationColumns;
  const count = footer ? cols : cols * 3;
  const rows = Math.ceil(count / cols);

  return (
    <View style={footer ? styles.footerWrap : styles.container}>
      {Array.from({ length: rows }).map((_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: cols }).map((__, c) => <SkeletonCard key={c} />)}
        </View>
      ))}
    </View>
  );
}
