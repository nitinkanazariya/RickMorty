import React, { useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Animated,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MoonIcon, SunIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../../../theme/ThemeContext';
import { fetchLocations } from '../../../services/locationService';
import useScrollHeader from '../../../hooks/useScrollHeader';
import LocationSkeleton from '../components/LocationSkeleton';
import { spacing, layout } from '../../../theme';
import type { LocationStackParamList } from '../../../types/navigation';
import type { Location } from '../../../types/api';
import { strings } from '../../../constants/strings';
import { useTabBar } from '../../../context/TabBarContext';
import { makeStyles } from './LocationListScreen.style';

type NavProp = NativeStackNavigationProp<LocationStackParamList, 'LocationList'>;

export default function LocationListScreen() {
  const navigation = useNavigation<NavProp>();
  const { colors, shadows, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const { headerTranslate, onScroll, onScrollEnd, HEADER_HEIGHT, topInset } = useScrollHeader();
  const { onTabBarScroll, onTabBarScrollEnd, totalTabBarHeight } = useTabBar();

  const handleScroll = useCallback((e: any) => { onScroll(e); onTabBarScroll(e); }, [onScroll, onTabBarScroll]);
  const handleScrollEnd = useCallback((e: any) => { onScrollEnd(e); onTabBarScrollEnd(e); }, [onScrollEnd, onTabBarScrollEnd]);

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
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          numColumns={layout.locationColumns}
          key={`loc-${layout.locationColumns}`}
          columnWrapperStyle={layout.locationColumns > 1 ? styles.row : undefined}
          contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 8, paddingBottom: totalTabBarHeight + 8, paddingHorizontal: spacing.md }}
          ListFooterComponent={isFetchingNextPage ? <LocationSkeleton footer /> : null}
        />
      )}
    </View>
  );
}
