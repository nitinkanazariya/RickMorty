import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchLocations } from '../../../services/locationService';
import useScrollHeader from '../../../hooks/useScrollHeader';
import type { LocationStackParamList } from '../../../types/navigation';
import type { Location } from '../../../types/api';

type NavProp = NativeStackNavigationProp<LocationStackParamList, 'LocationList'>;

export default function LocationListScreen() {
  const navigation = useNavigation<NavProp>();
  const { headerTranslate, onScroll, HEADER_HEIGHT } = useScrollHeader();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['locations'],
      queryFn: ({ pageParam }) => fetchLocations(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => (lastPage.info.next ? pages.length + 1 : undefined),
    });

  const locations = data?.pages.flatMap(p => p.results) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Location }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('LocationDetail', { id: item.id })}
        activeOpacity={0.8}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.dimension} numberOfLines={1}>
          {item.dimension}
        </Text>
        <Text style={styles.residents}>{item.residents.length} residents</Text>
      </TouchableOpacity>
    ),
    [navigation],
  );

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
        <Text style={styles.errorText}>Failed to load locations</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: HEADER_HEIGHT, transform: [{ translateY: headerTranslate }] }]}>
        <Text style={styles.headerTitle}>Locations</Text>
      </Animated.View>
      <FlatList
        data={locations}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onScroll={onScroll}
        scrollEventThrottle={16}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 8, paddingHorizontal: 12 }}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator color="#00b4d8" style={styles.footer} /> : null
        }
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
  row: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  name: { color: '#fff', fontWeight: '700', fontSize: 14 },
  type: { color: '#00b4d8', fontSize: 12 },
  dimension: { color: '#9ca3af', fontSize: 12 },
  residents: { color: '#6b7280', fontSize: 11, marginTop: 4 },
  footer: { paddingVertical: 16 },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 12 },
  retryBtn: { backgroundColor: '#00b4d8', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});
