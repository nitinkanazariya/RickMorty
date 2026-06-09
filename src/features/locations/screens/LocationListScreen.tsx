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
import { colors, typography, spacing, radii, layout, shadows } from '../../../theme';
import type { LocationStackParamList } from '../../../types/navigation';
import type { Location } from '../../../types/api';

type NavProp = NativeStackNavigationProp<LocationStackParamList, 'LocationList'>;

export default function LocationListScreen() {
  const navigation = useNavigation<NavProp>();
  const { headerTranslate, onScroll, onScrollEnd, HEADER_HEIGHT, topInset } = useScrollHeader();

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
        <View style={styles.cardHeader}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        </View>
        <View style={styles.typePill}>
          <Text style={styles.type} numberOfLines={1}>{item.type}</Text>
        </View>
        <Text style={styles.dimension} numberOfLines={2}>{item.dimension}</Text>
        <Text style={styles.residents}>{item.residents.length} residents</Text>
      </TouchableOpacity>
    ),
    [navigation],
  );

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
        <Text style={styles.errorText}>Failed to load locations</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: HEADER_HEIGHT, paddingTop: topInset, transform: [{ translateY: headerTranslate }] }]}>
        <Text style={styles.headerTitle}>Locations</Text>
      </Animated.View>
      <FlatList
        data={locations}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEnd}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
        numColumns={layout.locationColumns}
        key={`loc-${layout.locationColumns}`}
        columnWrapperStyle={layout.locationColumns > 1 ? styles.row : undefined}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 8, paddingHorizontal: spacing.md }}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator color={colors.accent} style={styles.footer} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0, zIndex: 10,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.accent + '55',
  },
  headerTitle: { color: colors.textPrimary, fontSize: typography.xxl, fontWeight: '800' },
  row: { gap: spacing.md, marginBottom: spacing.md },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardHeader: { marginBottom: spacing.sm },
  name: { color: colors.textPrimary, fontWeight: '800', fontSize: typography.base },
  typePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentDim,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  type: { color: colors.accent, fontSize: typography.xs, fontWeight: '700' },
  dimension: { color: colors.textMuted, fontSize: typography.xs, marginBottom: spacing.xs },
  residents: { color: colors.textDisabled, fontSize: typography.xs },
  footer: { paddingVertical: spacing.lg },
  errorText: { color: colors.error, fontSize: typography.lg, marginBottom: spacing.md },
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
