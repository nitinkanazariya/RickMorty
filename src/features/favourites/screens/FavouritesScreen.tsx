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
import { colors, typography, spacing, radii, layout, statusColors, shadows } from '../../../theme';
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
        <Text style={styles.emptySubtitle}>Tap Save on any character to add them here</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Character }) => {
    const statusColor = statusColors[item.status] ?? colors.statusUnknown;
    return (
      <View style={styles.card}>
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
      </View>
    );
  };

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
    borderBottomWidth: 1.5,
    borderBottomColor: colors.accent + '55',
  },
  headerTitle: { color: colors.textPrimary, fontSize: typography.xxl, fontWeight: '800' },
  list: { padding: spacing.md },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.card,
  },
  accentBar: { width: 4, alignSelf: 'stretch' },
  avatar: { width: 80, height: 80, backgroundColor: colors.surfaceDeep },
  info: { flex: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  name: { color: colors.textPrimary, fontWeight: '800', fontSize: typography.md, marginBottom: spacing.xs },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.xs,
  },
  dot: { width: 6, height: 6, borderRadius: radii.full },
  statusText: { fontSize: typography.xs, fontWeight: '700' },
  species: { color: colors.accentBlue, fontSize: typography.xs, fontWeight: '600', marginBottom: 2 },
  location: { color: colors.textDisabled, fontSize: typography.xs },
  removeBtn: { padding: spacing.lg },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xxxl,
    gap: spacing.lg,
  },
  emptyTitle: { color: colors.textMuted, fontSize: typography.xxl, fontWeight: '800' },
  emptySubtitle: { color: colors.textDimmed, fontSize: typography.base, textAlign: 'center' },
});
