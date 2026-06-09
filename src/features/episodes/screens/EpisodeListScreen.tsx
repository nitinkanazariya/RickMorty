import React, { useCallback, useMemo } from 'react';
import {
  View, Text, SectionList, StyleSheet,
  TouchableOpacity, Image, Animated,
} from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MoonIcon, SunIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors, Shadows } from '../../../theme/ThemeContext';
import { fetchEpisodes } from '../../../services/episodeService';
import { fetchCharactersByIds } from '../../../services/characterService';
import useScrollHeader from '../../../hooks/useScrollHeader';
import EpisodeSkeleton from '../components/EpisodeSkeleton';
import { typography, spacing, radii, layout } from '../../../theme';
import type { Episode, Character } from '../../../types/api';

function makeStyles(c: Colors, s: Shadows) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
    header: {
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
      backgroundColor: c.surfaceElevated, flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.lg, borderBottomWidth: 1.5, borderBottomColor: c.accent + '55',
    },
    headerTitle: { color: c.textPrimary, fontSize: typography.xxl, fontWeight: '800', flex: 1 },
    themeBtn: {
      width: 36, height: 36, borderRadius: radii.full, backgroundColor: c.surface,
      justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: c.border,
    },
    sectionHeader: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, backgroundColor: c.background },
    sectionPill: {
      alignSelf: 'flex-start', backgroundColor: c.accentDim, borderRadius: radii.full,
      paddingHorizontal: spacing.md, paddingVertical: 4, borderWidth: 1.5, borderColor: c.accent,
    },
    sectionTitle: { color: c.accent, fontSize: typography.sm, fontWeight: '800', letterSpacing: 0.5 },
    episodeRow: {
      backgroundColor: c.surface, marginHorizontal: spacing.md, marginBottom: spacing.sm,
      borderRadius: radii.md, padding: spacing.md, borderWidth: 1.5, borderColor: c.border, ...s.card,
    },
    episodeInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    codeTag: {
      backgroundColor: c.accentDim, borderRadius: radii.sm,
      paddingHorizontal: spacing.sm, paddingVertical: 3, borderWidth: 1, borderColor: c.accent,
    },
    episodeCode: { color: c.accent, fontSize: typography.xs, fontWeight: '800' },
    episodeTextBlock: { flex: 1 },
    episodeName: { color: c.textPrimary, fontSize: typography.base, fontWeight: '700' },
    airDate: { color: c.textDisabled, fontSize: typography.xs, marginTop: 2 },
    chevron: { color: c.textMuted, fontSize: typography.sm },
    avatarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
    avatarWrapper: { borderRadius: radii.full, borderWidth: 2, borderColor: c.border, overflow: 'hidden' },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    retryBtn: {
      backgroundColor: c.accentDim, paddingHorizontal: spacing.xxl, paddingVertical: 10,
      borderRadius: radii.full, borderWidth: 1.5, borderColor: c.accent,
    },
    retryText: { color: c.accent, fontWeight: '700' },
  });
}

function CharacterAvatars({ urls, styles, colors }: { urls: string[]; styles: ReturnType<typeof makeStyles>; colors: Colors }) {
  const ids = urls.slice(0, 6).map(u => Number(u.split('/').pop()));
  const { data: characters } = useQuery<Character[]>({
    queryKey: ['characters-by-ids', ids],
    queryFn: () => fetchCharactersByIds(ids),
    enabled: ids.length > 0,
  });
  return (
    <View style={styles.avatarRow}>
      {(characters ?? []).map(c => (
        <View key={c.id} style={styles.avatarWrapper}>
          <Image source={{ uri: c.image }} style={{ width: layout.episodeAvatarSize, height: layout.episodeAvatarSize }} />
        </View>
      ))}
    </View>
  );
}

function EpisodeRow({ episode }: { episode: Episode }) {
  const { colors, shadows } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const [expanded, setExpanded] = React.useState(false);
  return (
    <TouchableOpacity style={styles.episodeRow} onPress={() => setExpanded(p => !p)} activeOpacity={0.8}>
      <View style={styles.episodeInner}>
        <View style={styles.codeTag}><Text style={styles.episodeCode}>{episode.episode}</Text></View>
        <View style={styles.episodeTextBlock}>
          <Text style={styles.episodeName}>{episode.name}</Text>
          <Text style={styles.airDate}>{episode.air_date}</Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </View>
      {expanded && <CharacterAvatars urls={episode.characters} styles={styles} colors={colors} />}
    </TouchableOpacity>
  );
}

export default function EpisodeListScreen() {
  const { colors, shadows, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const { headerTranslate, onScroll, onScrollEnd, HEADER_HEIGHT, topInset } = useScrollHeader();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['episodes'],
      queryFn: ({ pageParam }) => fetchEpisodes(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => lastPage.info.next ? pages.length + 1 : undefined,
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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: HEADER_HEIGHT, paddingTop: topInset, transform: [{ translateY: headerTranslate }] }]}>
        <Text style={styles.headerTitle}>Episodes</Text>
        <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
          {isDark ? <SunIcon size={18} color={colors.accent} /> : <MoonIcon size={18} color={colors.accent} />}
        </TouchableOpacity>
      </Animated.View>

      {isLoading ? (
        <EpisodeSkeleton />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load episodes</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <EpisodeRow episode={item} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionPill}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
            </View>
          )}
          stickySectionHeadersEnabled={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          onScroll={onScroll}
          onScrollEndDrag={onScrollEnd}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 8 }}
          ListFooterComponent={isFetchingNextPage ? <EpisodeSkeleton footer /> : null}
        />
      )}
    </View>
  );
}
