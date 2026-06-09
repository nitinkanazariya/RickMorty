import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { fetchEpisodeById } from '../../../services/episodeService';
import { typography, spacing, radii } from '../../../theme';
import type { Episode } from '../../../types/api';

function makeStyles(c: Colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      padding: spacing.md,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: c.border,
      gap: spacing.md,
    },
    skeleton: {
      height: 56,
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: c.border,
    },
    badge: {
      backgroundColor: c.accentDim,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      minWidth: 52,
      alignItems: 'center',
    },
    badgeText: {
      color: c.accent,
      fontSize: typography.sm,
      fontWeight: '800',
    },
    info: { flex: 1 },
    name: { color: c.textPrimary, fontSize: typography.base, fontWeight: '600', marginBottom: 2 },
    airDate: { color: c.textMuted, fontSize: typography.sm },
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
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{data.episode}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{data.name}</Text>
        <Text style={styles.airDate}>{data.air_date}</Text>
      </View>
    </View>
  );
}
