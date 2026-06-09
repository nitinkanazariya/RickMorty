import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { Character } from '../../../types/api';

interface Props {
  character: Character;
  onPress: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  Alive: '#22c55e',
  Dead: '#ef4444',
  unknown: '#6b7280',
};

export default function CharacterCard({ character, onPress }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.imageWrapper}>
        {!imageLoaded && <View style={styles.imagePlaceholder} />}
        <Image
          source={{ uri: character.image }}
          style={[styles.image, !imageLoaded && styles.hidden]}
          onLoad={() => setImageLoaded(true)}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {character.name}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[character.status] ?? '#6b7280' }]} />
          <Text style={styles.statusText}>{character.status} — {character.species}</Text>
        </View>
        <Text style={styles.label}>Last seen:</Text>
        <Text style={styles.locationText} numberOfLines={1}>
          {character.location.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  imageWrapper: { width: 100, height: 100 },
  image: { width: 100, height: 100 },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#0f3460',
    position: 'absolute',
  },
  hidden: { opacity: 0, position: 'absolute' },
  info: { flex: 1, padding: 12, justifyContent: 'center' },
  name: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: '#9ca3af', fontSize: 13 },
  label: { color: '#6b7280', fontSize: 11, marginBottom: 2 },
  locationText: { color: '#d1d5db', fontSize: 13 },
});
