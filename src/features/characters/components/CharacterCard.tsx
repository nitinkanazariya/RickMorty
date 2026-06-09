import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii, layout, statusColors, shadows } from '../../../theme';
import type { Character } from '../../../types/api';

interface Props {
  character: Character;
  onPress: () => void;
}

export default function CharacterCard({ character, onPress }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const size = layout.cardImageSize;
  const statusColor = statusColors[character.status] ?? colors.statusUnknown;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.accentBar, { backgroundColor: statusColor }]} />

      <View style={[styles.imageWrapper, { width: size, height: size }]}>
        {!imageLoaded && <View style={[styles.imagePlaceholder, { width: size, height: size }]} />}
        <Image
          source={{ uri: character.image }}
          style={[{ width: size, height: size }, !imageLoaded && styles.hidden]}
          onLoad={() => setImageLoaded(true)}
        />
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '28', borderColor: statusColor }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>{character.status}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{character.name}</Text>
        <Text style={styles.species} numberOfLines={1}>{character.species}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Last seen</Text>
        <Text style={styles.locationText} numberOfLines={2}>{character.location.name}</Text>
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
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.card,
  },
  accentBar: {
    width: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePlaceholder: {
    backgroundColor: colors.surfaceDeep,
    position: 'absolute',
  },
  hidden: { opacity: 0, position: 'absolute' },
  statusBadge: {
    position: 'absolute',
    bottom: 6,
    left: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
  },
  statusBadgeText: {
    fontSize: typography.xs,
    fontWeight: '700',
  },
  info: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  name: { color: colors.textPrimary, fontWeight: '800', fontSize: typography.md, marginBottom: 2 },
  species: { color: colors.accentBlue, fontSize: typography.sm, fontWeight: '600', marginBottom: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.sm },
  label: { color: colors.textDisabled, fontSize: typography.xs, marginBottom: 2, letterSpacing: 0.5 },
  locationText: { color: colors.textSecondary, fontSize: typography.sm },
});
