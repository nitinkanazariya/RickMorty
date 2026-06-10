import React, { useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
} from 'react-native';
import { StarIcon, XMarkIcon, MoonIcon, SunIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { removeFavouriteById } from '../../../store/slices/favouritesSlice';
import { layout } from '../../../theme';
import type { Character } from '../../../types/api';
import type { RootTabParamList } from '../../../types/navigation';
import { strings } from '../../../constants/strings';
import { useTabBar } from '../../../context/TabBarContext';
import { useToast } from '../../../context/ToastContext';
import { makeStyles } from './FavouritesScreen.style';

type NavProp = NavigationProp<RootTabParamList>;

export default function FavouritesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { colors, shadows, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const { onTabBarScroll, onTabBarScrollEnd, totalTabBarHeight } = useTabBar();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const favourites = useAppSelector(s => s.favourites.items);
  const statusColorMap = { Alive: colors.statusAlive, Dead: colors.statusDead, unknown: colors.statusUnknown };

  const handleRemove = useCallback((id: number) => {
    dispatch(removeFavouriteById(id));
    showToast(strings.favourites.toastRemoved, 'remove');
  }, [dispatch, showToast]);

  const handleOpen = useCallback((item: Character) => {
    navigation.navigate('Characters', {
      screen: 'CharacterDetail',
      params: { id: item.id, image: item.image, character: item },
    });
  }, [navigation]);

  const renderItem = ({ item }: { item: Character }) => {
    const statusColor = statusColorMap[item.status as keyof typeof statusColorMap] ?? colors.statusUnknown;
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleOpen(item)} activeOpacity={0.8}>
        <View style={[styles.accentBar, { backgroundColor: statusColor }]} />
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor + '28', borderColor: statusColor }]}>
            <View style={[styles.dot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
          <Text style={styles.species}>{item.species}</Text>
          <Text style={styles.location} numberOfLines={1}>{item.location.name}</Text>
        </View>
        <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
          <XMarkIcon size={18} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { height: layout.headerHeight + insets.top, paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>{strings.favourites.title}</Text>
        <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
          {isDark ? <SunIcon size={18} color={colors.accent} /> : <MoonIcon size={18} color={colors.accent} />}
        </TouchableOpacity>
      </View>
      {favourites.length === 0 ? (
        <View style={styles.empty}>
          <StarIcon size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>{strings.favourites.emptyTitle}</Text>
          <Text style={styles.emptySubtitle}>{strings.favourites.emptySubtitle}</Text>
        </View>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          onScroll={onTabBarScroll}
          onScrollEndDrag={onTabBarScrollEnd}
          onMomentumScrollEnd={onTabBarScrollEnd}
          scrollEventThrottle={16}
          contentContainerStyle={[styles.list, { paddingBottom: totalTabBarHeight + 8 }]}
        />
      )}
    </View>
  );
}
