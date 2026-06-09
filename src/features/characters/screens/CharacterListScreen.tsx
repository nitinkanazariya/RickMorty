import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdjustmentsHorizontalIcon } from 'react-native-heroicons/outline';
import { fetchCharacters } from '../../../services/characterService';
import useDebounce from '../../../hooks/useDebounce';
import useScrollHeader from '../../../hooks/useScrollHeader';
import CharacterCard from '../components/CharacterCard';
import CharacterSkeleton from '../components/CharacterSkeleton';
import FilterModal from '../components/FilterModal';
import { useAppSelector, useAppDispatch } from '../../../hooks/useAppDispatch';
import { setStatusFilter, setGenderFilter } from '../../../store/slices/uiSlice';
import { colors, typography, spacing, radii } from '../../../theme';
import type { CharacterStackParamList } from '../../../types/navigation';
import type { Character } from '../../../types/api';

type NavProp = NativeStackNavigationProp<CharacterStackParamList, 'CharacterList'>;

export default function CharacterListScreen() {
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const { status, gender } = useAppSelector(s => s.ui.characterFilters);

  const [searchText, setSearchText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const debouncedSearch = useDebounce(searchText, 300);

  const { headerTranslate, onScroll, onScrollEnd, HEADER_HEIGHT, topInset } = useScrollHeader();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['characters', debouncedSearch, status, gender],
      queryFn: ({ pageParam }) =>
        fetchCharacters(pageParam as number, { name: debouncedSearch, status, gender }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) =>
        lastPage.info.next ? pages.length + 1 : undefined,
    });

  const characters = data?.pages.flatMap(p => p.results) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Character }) => (
      <CharacterCard
        character={item}
        onPress={() => navigation.navigate('CharacterDetail', { id: item.id })}
      />
    ),
    [navigation],
  );

  const renderFooter = () =>
    isFetchingNextPage ? <ActivityIndicator style={styles.footer} color={colors.accent} /> : null;

  const renderEmpty = () => {
    if (isLoading) return null;
    if (isError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load characters</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No characters found</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, { height: HEADER_HEIGHT, paddingTop: topInset, transform: [{ translateY: headerTranslate }] }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search characters..."
          placeholderTextColor={colors.textDisabled}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
          <AdjustmentsHorizontalIcon size={20} color={colors.accent} />
        </TouchableOpacity>
      </Animated.View>

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
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 8, paddingHorizontal: spacing.md }}
          onScroll={onScroll}
          onScrollEndDrag={onScrollEnd}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
        />
      )}

      <FilterModal
        visible={showFilter}
        currentStatus={status}
        currentGender={gender}
        onApply={(s, g) => {
          dispatch(setStatusFilter(s));
          dispatch(setGenderFilter(g));
          setShowFilter(false);
        }}
        onClose={() => setShowFilter(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.surfaceElevated,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.accent + '55',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontSize: typography.base,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  footer: { paddingVertical: spacing.lg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  errorText: { color: colors.error, fontSize: typography.lg, marginBottom: spacing.md },
  emptyText: { color: colors.textDisabled, fontSize: typography.lg },
  retryBtn: {
    backgroundColor: colors.accentDim,
    paddingHorizontal: spacing.xxl,
    paddingVertical: 10,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  retryText: { color: colors.accent, fontWeight: '700' },
});
