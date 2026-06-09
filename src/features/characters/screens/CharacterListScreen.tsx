import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TextInput,
  Animated, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdjustmentsHorizontalIcon, MoonIcon, SunIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../../../theme/ThemeContext';
import { fetchCharacters } from '../../../services/characterService';
import useDebounce from '../../../hooks/useDebounce';
import useScrollHeader from '../../../hooks/useScrollHeader';
import CharacterCard from '../components/CharacterCard';
import CharacterSkeleton from '../components/CharacterSkeleton';
import FilterModal from '../components/FilterModal';
import { useAppSelector, useAppDispatch } from '../../../hooks/useAppDispatch';
import { setStatusFilter, setGenderFilter } from '../../../store/slices/uiSlice';
import { spacing } from '../../../theme';
import type { CharacterStackParamList } from '../../../types/navigation';
import type { Character } from '../../../types/api';
import { strings } from '../../../constants/strings';
import { useTabBar } from '../../../context/TabBarContext';
import { makeStyles } from './CharacterListScreen.style';

type NavProp = NativeStackNavigationProp<CharacterStackParamList, 'CharacterList'>;

export default function CharacterListScreen() {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { status, gender } = useAppSelector(s => s.ui.characterFilters);
  const [searchText, setSearchText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const debouncedSearch = useDebounce(searchText, 300);
  const { headerTranslate, onScroll, onScrollEnd, HEADER_HEIGHT, topInset } = useScrollHeader();
  const { onTabBarScroll, onTabBarScrollEnd, totalTabBarHeight } = useTabBar();

  const handleScroll = useCallback((e: any) => { onScroll(e); onTabBarScroll(e); }, [onScroll, onTabBarScroll]);
  const handleScrollEnd = useCallback((e: any) => { onScrollEnd(e); onTabBarScrollEnd(e); }, [onScrollEnd, onTabBarScrollEnd]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['characters', debouncedSearch, status, gender],
      queryFn: ({ pageParam }) => fetchCharacters(pageParam as number, { name: debouncedSearch, status, gender }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => lastPage.info.next ? pages.length + 1 : undefined,
    });

  const characters = data?.pages.flatMap(p => p.results) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Character }) => (
      <CharacterCard character={item} onPress={() => navigation.navigate('CharacterDetail', { id: item.id, image: item.image })} />
    ),
    [navigation],
  );

  const renderFooter = () => isFetchingNextPage ? <ActivityIndicator style={styles.footer} color={colors.accent} /> : null;

  const renderEmpty = () => {
    if (isLoading) return null;
    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{strings.characters.errorLoad}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>{strings.common.retry}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <View style={styles.centered}><Text style={styles.emptyText}>{strings.characters.empty}</Text></View>;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: HEADER_HEIGHT, paddingTop: topInset, transform: [{ translateY: headerTranslate }] }]}>
        <TextInput
          style={styles.searchInput}
          placeholder={strings.characters.searchPlaceholder}
          placeholderTextColor={colors.textDisabled}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowFilter(true)}>
          <AdjustmentsHorizontalIcon size={20} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme}>
          {isDark ? <SunIcon size={20} color={colors.accent} /> : <MoonIcon size={20} color={colors.accent} />}
        </TouchableOpacity>
      </Animated.View>
      <View style={[styles.statusBarBg, { height: topInset }]} />

      {isLoading ? (
        <CharacterSkeleton />
      ) : (
        <FlatList
          data={characters}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 8, paddingBottom: totalTabBarHeight + 8, paddingHorizontal: spacing.md }}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        />
      )}

      <FilterModal
        visible={showFilter}
        currentStatus={status}
        currentGender={gender}
        onApply={(s, g) => { dispatch(setStatusFilter(s)); dispatch(setGenderFilter(g)); setShowFilter(false); }}
        onClose={() => setShowFilter(false)}
      />
    </View>
  );
}
