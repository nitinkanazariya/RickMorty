import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii, layout, statusColors } from '../../../theme';
import type { Character } from '../../../types/api';

interface Props {
  character: Character;
  onPress: () => void;
}

export default function CharacterCard({ character, onPress }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const size = layout.cardImageSize;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.imageWrapper, { width: size, height: size }]}>
        {!imageLoaded && <View style={[styles.imagePlaceholder, { width: size, height: size }]} />}
        <Image
          source={{ uri: character.image }}
          style={[{ width: size, height: size }, !imageLoaded && styles.hidden]}
          onLoad={() => setImageLoaded(true)}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{character.name}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColors[character.status] ?? colors.statusUnknown }]} />
          <Text style={styles.statusText}>{character.status} — {character.species}</Text>
        </View>
        <Text style={styles.label}>Last seen:</Text>
        <Text style={styles.locationText} numberOfLines={1}>{character.location.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  imageWrapper: { position: 'relative' },
  imagePlaceholder: {
    backgroundColor: colors.surfaceDeep,
    position: 'absolute',
  },
  hidden: { opacity: 0, position: 'absolute' },
  info: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  name: { color: colors.textPrimary, fontWeight: '700', fontSize: typography.md, marginBottom: spacing.xs },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  statusDot: { width: 8, height: 8, borderRadius: radii.full, marginRight: 6 },
  statusText: { color: colors.textMuted, fontSize: typography.sm },
  label: { color: colors.textDisabled, fontSize: typography.xs, marginBottom: 2 },
  locationText: { color: colors.textSecondary, fontSize: typography.sm },
});
