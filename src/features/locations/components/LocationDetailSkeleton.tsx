import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { spacing, layout } from '../../../theme';
import { makeStyles } from './LocationDetailSkeleton.style';

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
