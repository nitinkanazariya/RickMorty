import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchEpisodes } from '../../../services/episodeService';
import { fetchCharactersByIds } from '../../../services/characterService';
import useScrollHeader from '../../../hooks/useScrollHeader';
import { colors, typography, spacing, radii, layout } from '../../../theme';
import type { Episode, Character } from '../../../types/api';

function CharacterAvatars({ urls }: { urls: string[] }) {
  const ids = urls.slice(0, 6).map(u => Number(u.split('/').pop()));
  const { data: characters } = useQuery<Character[]>({
    queryKey: ['characters-by-ids', ids],
    queryFn: () => fetchCharactersByIds(ids),
    enabled: ids.length > 0,
  });

  return (
    <View style={styles.avatarRow}>
      {(characters ?? []).map(c => (
        <Image key={c.id} source={{ uri: c.image }} style={styles.avatar} />
      ))}
    </View>
  );
}

function EpisodeRow({ episode }: { episode: Episode }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <TouchableOpacity style={styles.episodeRow} onPress={() => setExpanded(p => !p)} activeOpacity={0.8}>
      <View style={styles.episodeHeader}>
        <Text style={styles.episodeCode}>{episode.episode}</Text>
        <Text style={styles.episodeName}>{episode.name}</Text>
        <Text style={styles.airDate}>{episode.air_date}</Text>
      </View>
      {expanded && <CharacterAvatars urls={episode.characters} />}
    </TouchableOpacity>
  );
}

export default function EpisodeListScreen() {
  const { headerTranslate, onScroll, HEADER_HEIGHT, topInset } = useScrollHeader();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['episodes'],
      queryFn: ({ pageParam }) => fetchEpisodes(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => (lastPage.info.next ? pages.length + 1 : undefined),
    });

  const allEpisodes = useMemo(() => data?.pages.flatMap(p => p.results) ?? [], [data]);

  const sections = useMemo(() => {
    const map = new Map<string, Episode[]>();
    allEpisodes.forEach(ep => {
      const season = ep.episode.substring(0, 3);
      if (!map.has(season)) map.set(season, []);
      map.get(season)!.push(ep);
    });
    return Array.from(map.entries()).map(([season, episodes]) => ({
      title: `Season ${Number(season.replace('S', ''))}`,
      data: episodes,
    }));
  }, [allEpisodes]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load episodes</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: HEADER_HEIGHT, paddingTop: topInset, transform: [{ translateY: headerTranslate }] }]}>
        <Text style={styles.headerTitle}>Episodes</Text>
      </Animated.View>
      <SectionList
        sections={sections}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <EpisodeRow episode={item} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 8 }}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.accent} style={styles.footer} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { color: colors.textPrimary, fontSize: typography.xxl, fontWeight: '700' },
  sectionHeader: { backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingVertical: 10 },
  sectionTitle: { color: colors.accent, fontSize: typography.md, fontWeight: '700' },
  episodeRow: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radii.md,
    padding: 14,
  },
  episodeHeader: { gap: 2 },
  episodeCode: { color: colors.accent, fontSize: typography.sm, fontWeight: '700' },
  episodeName: { color: colors.textPrimary, fontSize: typography.base, fontWeight: '600' },
  airDate: { color: colors.textDisabled, fontSize: typography.sm },
  avatarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  avatar: {
    width: layout.episodeAvatarSize,
    height: layout.episodeAvatarSize,
    borderRadius: layout.episodeAvatarSize / 2,
    backgroundColor: colors.surfaceDeep,
  },
  footer: { paddingVertical: spacing.lg },
  errorText: { color: colors.error, fontSize: typography.lg, marginBottom: spacing.md },
  retryBtn: { backgroundColor: colors.accent, paddingHorizontal: spacing.xxl, paddingVertical: 10, borderRadius: radii.sm },
  retryText: { color: colors.textPrimary, fontWeight: '600' },
});
