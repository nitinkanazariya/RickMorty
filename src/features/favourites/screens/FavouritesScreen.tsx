import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StarIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { removeFavouriteById } from '../../../store/slices/favouritesSlice';
import { colors, typography, spacing, radii, layout, statusColors } from '../../../theme';
import type { Character } from '../../../types/api';

export default function FavouritesScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const favourites = useAppSelector(s => s.favourites.items);

  const handleRemove = useCallback(
    (id: number) => {
      dispatch(removeFavouriteById(id));
    },
    [dispatch],
  );

  if (favourites.length === 0) {
    return (
      <View style={styles.empty}>
        <StarIcon size={64} color={colors.textFaint} />
        <Text style={styles.emptyTitle}>No favourites yet</Text>
        <Text style={styles.emptySubtitle}>Tap the save button on any character to add them here</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Character }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColors[item.status] ?? colors.statusUnknown }]} />
          <Text style={styles.statusText}>{item.status} — {item.species}</Text>
        </View>
        <Text style={styles.location} numberOfLines={1}>{item.location.name}</Text>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
        <XMarkIcon size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { height: layout.headerHeight + insets.top, paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>
      <FlatList
        data={favourites}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  headerTitle: { color: colors.textPrimary, fontSize: typography.xxl, fontWeight: '700' },
  list: { padding: spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    alignItems: 'center',
  },
  avatar: { width: 80, height: 80, backgroundColor: colors.surfaceDeep },
  info: { flex: 1, paddingHorizontal: spacing.md },
  name: { color: colors.textPrimary, fontWeight: '700', fontSize: typography.md, marginBottom: spacing.xs },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: radii.full, marginRight: 6 },
  statusText: { color: colors.textMuted, fontSize: typography.sm },
  location: { color: colors.textDisabled, fontSize: typography.sm },
  removeBtn: { padding: spacing.lg },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xxxl,
  },
  emptyTitle: { color: colors.textMuted, fontSize: typography.xxl, fontWeight: '700', marginBottom: spacing.sm },
  emptySubtitle: { color: colors.textDimmed, fontSize: typography.base, textAlign: 'center' },
});
