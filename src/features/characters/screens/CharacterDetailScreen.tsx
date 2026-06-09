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
import { ChevronLeftIcon, StarIcon } from 'react-native-heroicons/outline';
import { StarIcon as StarIconSolid } from 'react-native-heroicons/solid';
import { fetchCharacterById } from '../../../services/characterService';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { addFavourite, removeFavouriteById } from '../../../store/slices/favouritesSlice';
import EpisodeChip from '../components/EpisodeChip';
import { colors, typography, spacing, radii, layout, statusColors } from '../../../theme';
import type { CharacterStackParamList } from '../../../types/navigation';

type RouteProp = NativeStackScreenProps<CharacterStackParamList, 'CharacterDetail'>['route'];
type NavProp = NativeStackNavigationProp<CharacterStackParamList>;

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
    if (isFavourite) dispatch(removeFavouriteById(id));
    else dispatch(addFavourite(character));
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
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

  const avatarSize = layout.detailAvatarSize;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <ChevronLeftIcon size={20} color={colors.accent} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        {!imageLoaded && (
          <View style={[styles.imagePlaceholder, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} />
        )}
        <Image
          source={{ uri: character.image }}
          style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
          onLoad={() => setImageLoaded(true)}
        />
      </View>

      <TouchableOpacity
        style={[styles.favBtn, isFavourite && styles.favBtnActive]}
        onPress={toggleFavourite}>
        {isFavourite
          ? <StarIconSolid size={18} color={colors.textPrimary} />
          : <StarIcon size={18} color={colors.accent} />}
        <Text style={[styles.favBtnText, isFavourite && styles.favBtnTextActive]}>
          {isFavourite ? 'Saved' : 'Save'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.characterName}>{character.name}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColors[character.status] ?? colors.statusUnknown }]} />
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
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 10 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  backText: { color: colors.accent, fontSize: typography.lg },
  imageWrapper: { alignItems: 'center', marginVertical: spacing.lg },
  imagePlaceholder: { backgroundColor: colors.surface, position: 'absolute' },
  avatar: { borderWidth: 3, borderColor: colors.accent },
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: spacing.xl,
  },
  favBtnActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  favBtnText: { color: colors.accent, fontWeight: '700', fontSize: typography.md },
  favBtnTextActive: { color: colors.textPrimary },
  infoCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  characterName: { color: colors.textPrimary, fontSize: typography.xxxl, fontWeight: '800', marginBottom: spacing.sm },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  dot: { width: 10, height: 10, borderRadius: radii.full, marginRight: spacing.sm },
  statusText: { color: colors.textMuted, fontSize: typography.base },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '45%' },
  gridLabel: { color: colors.textDisabled, fontSize: typography.sm, marginBottom: 2 },
  gridValue: { color: colors.textSecondary, fontSize: typography.base, fontWeight: '500' },
  episodesSection: { marginBottom: spacing.xxxl },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.xl, fontWeight: '700', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  errorText: { color: colors.error, fontSize: typography.lg, marginBottom: spacing.md },
  retryBtn: { backgroundColor: colors.accent, paddingHorizontal: spacing.xxl, paddingVertical: 10, borderRadius: radii.sm },
  retryText: { color: colors.textPrimary, fontWeight: '600' },
});
