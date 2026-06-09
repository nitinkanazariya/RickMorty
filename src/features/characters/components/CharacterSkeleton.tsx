import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

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

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.image} />
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
  container: { paddingTop: 68, paddingHorizontal: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    height: 100,
  },
  image: { width: 100, height: 100, backgroundColor: '#0f3460' },
  lines: { flex: 1, padding: 12, justifyContent: 'center', gap: 8 },
  line1: { height: 14, backgroundColor: '#0f3460', borderRadius: 4, width: '70%' },
  line2: { height: 11, backgroundColor: '#0f3460', borderRadius: 4, width: '50%' },
  line3: { height: 11, backgroundColor: '#0f3460', borderRadius: 4, width: '60%' },
});
