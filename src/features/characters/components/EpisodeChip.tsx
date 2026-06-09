import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchEpisodeById } from '../../../services/episodeService';
import { colors, typography, spacing, radii, layout } from '../../../theme';
import type { Episode } from '../../../types/api';

interface Props {
  url: string;
}

export default function EpisodeChip({ url }: Props) {
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

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    width: layout.episodeChipWidth,
  },
  skeleton: {
    width: layout.episodeChipWidth,
    height: 56,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
  },
  code: { color: colors.accent, fontSize: typography.sm, fontWeight: '700', marginBottom: spacing.xs },
  name: { color: colors.textSecondary, fontSize: typography.sm },
});
