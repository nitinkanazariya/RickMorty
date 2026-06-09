import React, { useCallback, useMemo, useState, useRef } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, Image, Animated, ScrollView,
} from 'react-native';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MoonIcon, SunIcon, ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../../../theme/ThemeContext';
import { fetchEpisodes } from '../../../services/episodeService';
import { fetchCharactersByIds } from '../../../services/characterService';
import useScrollHeader from '../../../hooks/useScrollHeader';
import EpisodeSkeleton from '../components/EpisodeSkeleton';
import { layout } from '../../../theme';
import type { Episode, Character } from '../../../types/api';
import { strings } from '../../../constants/strings';
import { useTabBar } from '../../../context/TabBarContext';
import { makeStyles, EpisodeListStyles } from './EpisodeListScreen.style';

function CharacterAvatars({ urls, styles }: { urls: string[]; styles: EpisodeListStyles }) {
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

function EpisodeRow({ episode, styles }: { episode: Episode; styles: EpisodeListStyles }) {
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(anim, { toValue, duration: 200, useNativeDriver: true }).start();
    setExpanded(p => !p);
  };

  return (
    <TouchableOpacity style={styles.episodeRow} onPress={toggle} activeOpacity={0.8}>
      <View style={styles.episodeInner}>
        <View style={styles.codeTag}><Text style={styles.episodeCode}>{episode.episode}</Text></View>
        <View style={styles.episodeTextBlock}>
          <Text style={styles.episodeName}>{episode.name}</Text>
          <Text style={styles.airDate}>{episode.air_date}</Text>
        </View>
        {expanded ? <ChevronUpIcon size={16} color={styles.airDate.color as string} /> : <ChevronDownIcon size={16} color={styles.airDate.color as string} />}
      </View>
      {expanded && (
        <Animated.View style={{ opacity: anim }}>
          <CharacterAvatars urls={episode.characters} styles={styles} />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

export default function EpisodeListScreen() {
  const { colors, shadows, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const { headerTranslate, onScroll, onScrollEnd, HEADER_HEIGHT, topInset } = useScrollHeader();
  const { onTabBarScroll, onTabBarScrollEnd, totalTabBarHeight } = useTabBar();

  const handleScroll = useCallback((e: any) => { onScroll(e); onTabBarScroll(e); }, [onScroll, onTabBarScroll]);
  const handleScrollEnd = useCallback((e: any) => { onScrollEnd(e); onTabBarScrollEnd(e); }, [onScrollEnd, onTabBarScrollEnd]);
  const [selectedSeason, setSelectedSeason] = useState('S01');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['episodes'],
      queryFn: ({ pageParam }) => fetchEpisodes(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => lastPage.info.next ? pages.length + 1 : undefined,
    });

  const allEpisodes = useMemo(() => data?.pages.flatMap(p => p.results) ?? [], [data]);

  const seasons = useMemo(() => {
    const keys = new Set(allEpisodes.map(ep => ep.episode.substring(0, 3)));
    return Array.from(keys).sort();
  }, [allEpisodes]);

  const filteredEpisodes = useMemo(
    () => allEpisodes.filter(ep => ep.episode.startsWith(selectedSeason)),
    [allEpisodes, selectedSeason],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const TAB_ROW_HEIGHT = 52;
  const FULL_HEADER = HEADER_HEIGHT + TAB_ROW_HEIGHT;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { paddingTop: topInset, transform: [{ translateY: headerTranslate }] }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{strings.episodes.title}</Text>
          <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
            {isDark ? <SunIcon size={18} color={colors.accent} /> : <MoonIcon size={18} color={colors.accent} />}
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {seasons.map(s => {
            const active = s === selectedSeason;
            const num = Number(s.replace('S', ''));
            return (
              <TouchableOpacity
                key={s}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setSelectedSeason(s)}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>S{num}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
      <View style={[styles.statusBarBg, { height: topInset }]} />

      {isLoading ? (
        <EpisodeSkeleton />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{strings.episodes.errorLoad}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>{strings.common.retry}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredEpisodes}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <EpisodeRow episode={item} styles={styles} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingTop: FULL_HEADER + 8, paddingBottom: totalTabBarHeight + 8 }}
          ListFooterComponent={isFetchingNextPage ? <EpisodeSkeleton footer /> : null}
        />
      )}
    </View>
  );
}
