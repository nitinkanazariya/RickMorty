import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors, Shadows } from '../../../theme/ThemeContext';
import { typography, spacing, radii, layout } from '../../../theme';
import type { Character } from '../../../types/api';

interface Props {
  character: Character;
  onPress: () => void;
}

function makeStyles(c: Colors, s: Shadows) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      marginBottom: spacing.md,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: c.border,
      ...s.card,
    },
    accentBar: { width: 4 },
    imageWrapper: { position: 'relative' },
    imagePlaceholder: { backgroundColor: c.surfaceDeep, position: 'absolute' },
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
    statusDot: { width: 6, height: 6, borderRadius: radii.full },
    statusBadgeText: { fontSize: typography.xs, fontWeight: '700' },
    info: { flex: 1, padding: spacing.md, justifyContent: 'center' },
    name: { color: c.textPrimary, fontWeight: '800', fontSize: typography.md, marginBottom: 2 },
    species: { color: c.accentBlue, fontSize: typography.sm, fontWeight: '600', marginBottom: spacing.sm },
    divider: { height: 1, backgroundColor: c.border, marginBottom: spacing.sm },
    label: { color: c.textDisabled, fontSize: typography.xs, marginBottom: 2, letterSpacing: 0.5 },
    locationText: { color: c.textSecondary, fontSize: typography.sm },
  });
}

const SharedView = View as React.ComponentType<React.ComponentProps<typeof View> & { sharedTransitionTag?: string }>;

export default function CharacterCard({ character, onPress }: Props) {
  const { colors, shadows } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const size = layout.cardImageSize;
  const statusColor = { Alive: colors.statusAlive, Dead: colors.statusDead, unknown: colors.statusUnknown }[character.status] ?? colors.statusUnknown;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.accentBar, { backgroundColor: statusColor }]} />
      <SharedView style={[styles.imageWrapper, { width: size, height: size }]} sharedTransitionTag={`char-img-${character.id}`}>
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
      </SharedView>
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
