import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { makeStyles } from './EpisodeSkeleton.style';

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
