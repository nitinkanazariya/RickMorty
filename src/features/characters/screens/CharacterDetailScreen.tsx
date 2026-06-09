import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchCharacterById } from '../../../services/characterService';
import { fetchEpisodeById } from '../../../services/episodeService';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { addFavourite, removeFavouriteById } from '../../../store/slices/favouritesSlice';
import type { CharacterStackParamList } from '../../../types/navigation';
import type { Episode } from '../../../types/api';

type RouteProp = NativeStackScreenProps<CharacterStackParamList, 'CharacterDetail'>['route'];
type NavProp = NativeStackNavigationProp<CharacterStackParamList>;

const STATUS_COLORS: Record<string, string> = {
  Alive: '#22c55e',
  Dead: '#ef4444',
  unknown: '#6b7280',
};

function EpisodeChip({ url }: { url: string }) {
  const id = Number(url.split('/').pop());
  const { data } = useQuery<Episode>({
    queryKey: ['episode', id],
    queryFn: () => fetchEpisodeById(id),
    enabled: !!id,
  });

  if (!data) return <View style={styles.episodeChipSkeleton} />;

  return (
    <View style={styles.episodeChip}>
      <Text style={styles.episodeCode}>{data.episode}</Text>
      <Text style={styles.episodeName} numberOfLines={1}>
        {data.name}
      </Text>
    </View>
  );
}

export default function CharacterDetailScreen() {
  const route = useRoute<RouteProp>();
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const { id } = route.params;
  const [imageLoaded, setImageLoaded] = useState(false);

  const favourites = useAppSelector(s => s.favourites.items);
  const isFavourite = favourites.some(c => c.id === id);

  const { data: character, isLoading, isError, refetch } = useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacterById(id),
  });

  const toggleFavourite = () => {
    if (!character) return;
    if (isFavourite) {
      dispatch(removeFavouriteById(id));
    } else {
      dispatch(addFavourite(character));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00b4d8" />
      </View>
    );
  }

  if (isError || !character) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load character</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        {!imageLoaded && <View style={styles.imagePlaceholder} />}
        <Image
          source={{ uri: character.image }}
          style={styles.avatar}
          onLoad={() => setImageLoaded(true)}
        />
      </View>

      <TouchableOpacity
        style={[styles.favBtn, isFavourite && styles.favBtnActive]}
        onPress={toggleFavourite}>
        <Text style={styles.favBtnText}>{isFavourite ? '★ Saved' : '☆ Save'}</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.characterName}>{character.name}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: STATUS_COLORS[character.status] ?? '#6b7280' }]} />
          <Text style={styles.statusText}>{character.status}</Text>
        </View>

        <View style={styles.grid}>
          {[
            ['Species', character.species],
            ['Gender', character.gender],
            ['Type', character.type || 'N/A'],
            ['Origin', character.origin.name],
            ['Location', character.location.name],
          ].map(([label, value]) => (
            <View key={label} style={styles.gridItem}>
              <Text style={styles.gridLabel}>{label}</Text>
              <Text style={styles.gridValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.episodesSection}>
        <Text style={styles.sectionTitle}>Episodes ({character.episode.length})</Text>
        <FlatList
          data={character.episode}
          horizontal
          keyExtractor={item => item}
          renderItem={({ item }) => <EpisodeChip url={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' },
  backBtn: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backText: { color: '#00b4d8', fontSize: 16 },
  imageWrapper: { alignItems: 'center', marginVertical: 16 },
  avatar: { width: 180, height: 180, borderRadius: 90, borderWidth: 3, borderColor: '#00b4d8' },
  imagePlaceholder: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#16213e', position: 'absolute' },
  favBtn: {
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#00b4d8',
    marginBottom: 20,
  },
  favBtnActive: { backgroundColor: '#00b4d8' },
  favBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  infoCard: {
    marginHorizontal: 16,
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  characterName: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { color: '#9ca3af', fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '45%' },
  gridLabel: { color: '#6b7280', fontSize: 12, marginBottom: 2 },
  gridValue: { color: '#d1d5db', fontSize: 14, fontWeight: '500' },
  episodesSection: { marginBottom: 32 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  episodeChip: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    width: 130,
  },
  episodeChipSkeleton: {
    width: 130,
    height: 56,
    backgroundColor: '#16213e',
    borderRadius: 10,
  },
  episodeCode: { color: '#00b4d8', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  episodeName: { color: '#d1d5db', fontSize: 12 },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 12 },
  retryBtn: { backgroundColor: '#00b4d8', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});
