import React, { useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MoonIcon, SunIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors, Shadows } from '../../../theme/ThemeContext';
import { fetchLocations } from '../../../services/locationService';
import useScrollHeader from '../../../hooks/useScrollHeader';
import LocationSkeleton from '../components/LocationSkeleton';
import { typography, spacing, radii, layout } from '../../../theme';
import type { LocationStackParamList } from '../../../types/navigation';
import type { Location } from '../../../types/api';
import { strings } from '../../../constants/strings';

type NavProp = NativeStackNavigationProp<LocationStackParamList, 'LocationList'>;

function makeStyles(c: Colors, s: Shadows) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
    statusBarBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 11, backgroundColor: c.surfaceElevated },
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
    row: { gap: spacing.md, marginBottom: spacing.md },
    card: {
      flex: 1, backgroundColor: c.surface, borderRadius: radii.lg,
      padding: spacing.md, borderWidth: 1.5, borderColor: c.border, ...s.card,
    },
    cardHeader: { marginBottom: spacing.sm },
    name: { color: c.textPrimary, fontWeight: '800', fontSize: typography.base },
    typePill: {
      alignSelf: 'flex-start', backgroundColor: c.accentDim, borderRadius: radii.full,
      paddingHorizontal: spacing.sm, paddingVertical: 2, marginBottom: spacing.sm, borderWidth: 1, borderColor: c.accent,
    },
    type: { color: c.accent, fontSize: typography.xs, fontWeight: '700' },
    dimension: { color: c.textMuted, fontSize: typography.xs, marginBottom: spacing.xs },
    residents: { color: c.textDisabled, fontSize: typography.xs },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    retryBtn: {
      backgroundColor: c.accentDim, paddingHorizontal: spacing.xxl, paddingVertical: 10,
      borderRadius: radii.full, borderWidth: 1.5, borderColor: c.accent,
    },
    retryText: { color: c.accent, fontWeight: '700' },
  });
}

export default function LocationListScreen() {
  const navigation = useNavigation<NavProp>();
  const { colors, shadows, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const { headerTranslate, onScroll, onScrollEnd, HEADER_HEIGHT, topInset } = useScrollHeader();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } =
    useInfiniteQuery({
      queryKey: ['locations'],
      queryFn: ({ pageParam }) => fetchLocations(pageParam as number),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => lastPage.info.next ? pages.length + 1 : undefined,
    });

  const locations = data?.pages.flatMap(p => p.results) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Location }) => (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('LocationDetail', { id: item.id })} activeOpacity={0.8}>
        <View style={styles.cardHeader}><Text style={styles.name} numberOfLines={2}>{item.name}</Text></View>
        <View style={styles.typePill}><Text style={styles.type} numberOfLines={1}>{item.type}</Text></View>
        <Text style={styles.dimension} numberOfLines={2}>{item.dimension}</Text>
        <Text style={styles.residents}>{strings.locations.residents(item.residents.length)}</Text>
      </TouchableOpacity>
    ),
    [navigation, styles],
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: HEADER_HEIGHT, paddingTop: topInset, transform: [{ translateY: headerTranslate }] }]}>
        <Text style={styles.headerTitle}>{strings.locations.title}</Text>
        <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
          {isDark ? <SunIcon size={18} color={colors.accent} /> : <MoonIcon size={18} color={colors.accent} />}
        </TouchableOpacity>
      </Animated.View>
      <View style={[styles.statusBarBg, { height: topInset }]} />

      {isLoading ? (
        <LocationSkeleton />
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{strings.locations.errorLoad}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>{strings.common.retry}</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
          ListFooterComponent={isFetchingNextPage ? <LocationSkeleton footer /> : null}
        />
      )}
    </View>
  );
}
