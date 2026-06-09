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
import { fetchCharacters } from '../../../services/characterService';
import useDebounce from '../../../hooks/useDebounce';
import useScrollHeader from '../../../hooks/useScrollHeader';
import CharacterCard from '../components/CharacterCard';
import CharacterSkeleton from '../components/CharacterSkeleton';
import FilterModal from '../components/FilterModal';
import { useAppSelector, useAppDispatch } from '../../../hooks/useAppDispatch';
import { setStatusFilter, setGenderFilter } from '../../../store/slices/uiSlice';
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

  const { headerTranslate, onScroll, HEADER_HEIGHT } = useScrollHeader();

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
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
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

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return <ActivityIndicator style={styles.footer} color="#00b4d8" />;
  };

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
        style={[
          styles.header,
          { height: HEADER_HEIGHT, transform: [{ translateY: headerTranslate }] },
        ]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search characters..."
          placeholderTextColor="#6b7280"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
          <Text style={styles.filterText}>Filter</Text>
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
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 8, paddingHorizontal: 12 }}
          onScroll={onScroll}
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
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#1a1a2e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#16213e',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: 14,
  },
  filterBtn: {
    backgroundColor: '#00b4d8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  footer: { paddingVertical: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 12 },
  emptyText: { color: '#6b7280', fontSize: 16 },
  retryBtn: {
    backgroundColor: '#00b4d8',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
