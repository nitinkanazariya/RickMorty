import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchEpisodes } from '../../../services/episodeService';
import { fetchCharactersByIds } from '../../../services/characterService';
import useScrollHeader from '../../../hooks/useScrollHeader';
import { Animated } from 'react-native';
import type { Episode, Character } from '../../../types/api';

interface EpisodeRowProps {
  episode: Episode;
}

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

function EpisodeRow({ episode }: EpisodeRowProps) {
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
  const { headerTranslate, onScroll, HEADER_HEIGHT } = useScrollHeader();

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
        <ActivityIndicator size="large" color="#00b4d8" />
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
      <Animated.View style={[styles.header, { height: HEADER_HEIGHT, transform: [{ translateY: headerTranslate }] }]}>
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
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color="#00b4d8" style={styles.footer} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sectionHeader: { backgroundColor: '#0f0f1a', paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle: { color: '#00b4d8', fontSize: 15, fontWeight: '700' },
  episodeRow: { backgroundColor: '#16213e', marginHorizontal: 12, marginBottom: 8, borderRadius: 10, padding: 14 },
  episodeHeader: { gap: 2 },
  episodeCode: { color: '#00b4d8', fontSize: 12, fontWeight: '700' },
  episodeName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  airDate: { color: '#6b7280', fontSize: 12 },
  avatarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0f3460' },
  footer: { paddingVertical: 16 },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 12 },
  retryBtn: { backgroundColor: '#00b4d8', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});
