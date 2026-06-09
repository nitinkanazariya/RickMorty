import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { makeStyles } from './CharacterDetailSkeleton.style';

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
