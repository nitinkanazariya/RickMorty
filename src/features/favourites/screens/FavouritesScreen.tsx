import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { removeFavouriteById } from '../../../store/slices/favouritesSlice';
import type { Character } from '../../../types/api';

const STATUS_COLORS: Record<string, string> = {
  Alive: '#22c55e',
  Dead: '#ef4444',
  unknown: '#6b7280',
};

export default function FavouritesScreen() {
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
        <Text style={styles.emptyIcon}>☆</Text>
        <Text style={styles.emptyTitle}>No favourites yet</Text>
        <Text style={styles.emptySubtitle}>Tap the save button on any character to add them here</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Character }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: STATUS_COLORS[item.status] ?? '#6b7280' }]} />
          <Text style={styles.statusText}>{item.status} — {item.species}</Text>
        </View>
        <Text style={styles.location} numberOfLines={1}>
          {item.location.name}
        </Text>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item.id)}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  header: {
    height: 60,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  list: { padding: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  avatar: { width: 80, height: 80, backgroundColor: '#0f3460' },
  info: { flex: 1, paddingHorizontal: 12 },
  name: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: '#9ca3af', fontSize: 12 },
  location: { color: '#6b7280', fontSize: 12 },
  removeBtn: { padding: 16 },
  removeText: { color: '#ef4444', fontSize: 16, fontWeight: '700' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
    padding: 32,
  },
  emptyIcon: { fontSize: 64, color: '#374151', marginBottom: 16 },
  emptyTitle: { color: '#9ca3af', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { color: '#4b5563', fontSize: 14, textAlign: 'center' },
});
