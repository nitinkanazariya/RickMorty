import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { fetchEpisodeById } from '../../../services/episodeService';
import { typography, spacing, radii, layout } from '../../../theme';
import type { Episode } from '../../../types/api';

function makeStyles(c: Colors) {
  return StyleSheet.create({
    chip: {
      backgroundColor: c.surface,
      borderRadius: radii.md,
      padding: spacing.md,
      width: layout.episodeChipWidth,
      borderWidth: 1.5,
      borderColor: c.border,
    },
    skeleton: {
      width: layout.episodeChipWidth,
      height: 56,
      backgroundColor: c.surface,
      borderRadius: radii.md,
      borderWidth: 1.5,
      borderColor: c.border,
    },
    code: { color: c.accent, fontSize: typography.sm, fontWeight: '800', marginBottom: spacing.xs },
    name: { color: c.textSecondary, fontSize: typography.sm },
  });
}

export default function EpisodeChip({ url }: { url: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const id = Number(url.split('/').pop());

  const { data } = useQuery<Episode>({
    queryKey: ['episode', id],
    queryFn: () => fetchEpisodeById(id),
    enabled: !!id,
  });

  if (!data) return <View style={styles.skeleton} />;

  return (
    <View style={styles.chip}>
      <Text style={styles.code}>{data.episode}</Text>
      <Text style={styles.name} numberOfLines={1}>{data.name}</Text>
    </View>
  );
}
