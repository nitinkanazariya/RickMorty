import React, { useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import { StarIcon, XMarkIcon, MoonIcon, SunIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors, Shadows } from '../../../theme/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { removeFavouriteById } from '../../../store/slices/favouritesSlice';
import { typography, spacing, radii, layout } from '../../../theme';
import type { Character } from '../../../types/api';
import type { RootTabParamList } from '../../../types/navigation';
import { strings } from '../../../constants/strings';

type NavProp = NavigationProp<RootTabParamList>;

function makeStyles(c: Colors, s: Shadows) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: {
      backgroundColor: c.surfaceElevated, flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: spacing.lg, borderBottomWidth: 1.5, borderBottomColor: c.accent + '55',
    },
    headerTitle: { color: c.textPrimary, fontSize: typography.xxl, fontWeight: '800', flex: 1 },
    themeBtn: {
      width: 36, height: 36, borderRadius: radii.full, backgroundColor: c.surface,
      justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: c.border,
    },
    list: { padding: spacing.md },
    card: {
      flexDirection: 'row', backgroundColor: c.surface, borderRadius: radii.lg,
      marginBottom: spacing.md, overflow: 'hidden', alignItems: 'center',
      borderWidth: 1.5, borderColor: c.border, ...s.card,
    },
    accentBar: { width: 4, alignSelf: 'stretch' },
    avatar: { width: 80, height: 80, backgroundColor: c.surfaceDeep },
    info: { flex: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    name: { color: c.textPrimary, fontWeight: '800', fontSize: typography.md, marginBottom: spacing.xs },
    statusPill: {
      flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 4,
      borderRadius: radii.full, borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 2, marginBottom: spacing.xs,
    },
    dot: { width: 6, height: 6, borderRadius: radii.full },
    statusText: { fontSize: typography.xs, fontWeight: '700' },
    species: { color: c.accentBlue, fontSize: typography.xs, fontWeight: '600', marginBottom: 2 },
    location: { color: c.textDisabled, fontSize: typography.xs },
    removeBtn: { padding: spacing.lg },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background, padding: spacing.xxxl, gap: spacing.lg },
    emptyTitle: { color: c.textMuted, fontSize: typography.xxl, fontWeight: '800' },
    emptySubtitle: { color: c.textMuted, fontSize: typography.base, textAlign: 'center' },
  });
}

export default function FavouritesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { colors, shadows, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadows), [colors, shadows]);
  const dispatch = useAppDispatch();
  const favourites = useAppSelector(s => s.favourites.items);
  const statusColorMap = { Alive: colors.statusAlive, Dead: colors.statusDead, unknown: colors.statusUnknown };

  const handleRemove = useCallback((id: number) => dispatch(removeFavouriteById(id)), [dispatch]);

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
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}
