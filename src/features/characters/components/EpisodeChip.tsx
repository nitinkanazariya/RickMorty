import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../../theme/ThemeContext';
import { fetchEpisodeById } from '../../../services/episodeService';
import type { Episode } from '../../../types/api';
import { makeStyles } from './EpisodeChip.style';

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
