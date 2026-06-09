import React, { useRef, useEffect, useMemo } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, FlatList, Animated,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeftIcon, StarIcon } from 'react-native-heroicons/outline';
import { StarIcon as StarIconSolid } from 'react-native-heroicons/solid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { fetchCharacterById } from '../../../services/characterService';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { addFavourite, removeFavouriteById } from '../../../store/slices/favouritesSlice';
import EpisodeChip from '../components/EpisodeChip';
import CharacterDetailSkeleton from '../components/CharacterDetailSkeleton';
import { typography, spacing, radii, layout } from '../../../theme';
import type { CharacterStackParamList } from '../../../types/navigation';

type RouteProp = NativeStackScreenProps<CharacterStackParamList, 'CharacterDetail'>['route'];
type NavProp = NativeStackNavigationProp<CharacterStackParamList>;

const SharedView = View as React.ComponentType<React.ComponentProps<typeof View> & { sharedTransitionTag?: string }>;

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centered: { justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxxl },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
    backText: { color: c.accent, fontSize: typography.lg },
    imageWrapper: { alignItems: 'center', marginVertical: spacing.lg },
    avatarRing: { overflow: 'hidden', borderWidth: 3, borderColor: c.accent },
    favBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center',
      paddingHorizontal: 28, paddingVertical: 10, borderRadius: radii.full,
      backgroundColor: c.surface, borderWidth: 1, borderColor: c.accent, marginBottom: spacing.xl,
    },
    favBtnActive: { backgroundColor: c.accent, borderColor: c.accent },
    favBtnText: { color: c.accent, fontWeight: '700', fontSize: typography.md },
    favBtnTextActive: { color: c.textPrimary },
    infoCard: {
      marginHorizontal: spacing.lg, backgroundColor: c.surface,
      borderRadius: radii.xl, padding: spacing.xl, marginBottom: spacing.xl,
    },
    characterName: { color: c.textPrimary, fontSize: typography.xxxl, fontWeight: '800', marginBottom: spacing.sm },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
    dot: { width: 10, height: 10, borderRadius: radii.full, marginRight: spacing.sm },
    statusText: { color: c.textMuted, fontSize: typography.base },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    gridItem: { width: '45%' },
    gridLabel: { color: c.textDisabled, fontSize: typography.sm, marginBottom: 2 },
    gridValue: { color: c.textSecondary, fontSize: typography.base, fontWeight: '500' },
    episodesSection: { marginBottom: spacing.xxxl },
    sectionTitle: { color: c.textPrimary, fontSize: typography.xl, fontWeight: '700', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    retryBtn: { backgroundColor: c.accent, paddingHorizontal: spacing.xxl, paddingVertical: 10, borderRadius: radii.sm },
    retryText: { color: c.textPrimary, fontWeight: '600' },
  });
}

function useEntrance(delay: number) {
  const opacity = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(18)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 260, delay, useNativeDriver: true }),
      Animated.timing(ty, { toValue: 0, duration: 260, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY: ty }] };
}

export default function CharacterDetailScreen() {
  const route = useRoute<RouteProp>();
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id, image } = route.params;

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

  const statusColorMap = { Alive: colors.statusAlive, Dead: colors.statusDead, unknown: colors.statusUnknown };
  const headerAnim = useEntrance(80);
  const bodyAnim = useEntrance(200);
  const avatarSize = layout.detailAvatarSize;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={headerAnim}>
        <TouchableOpacity style={[styles.backBtn, { paddingTop: insets.top + spacing.sm }]} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={20} color={colors.accent} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.imageWrapper}>
        <SharedView sharedTransitionTag={`char-img-${id}`} style={[styles.avatarRing, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
          <Image source={{ uri: image }} style={{ width: avatarSize, height: avatarSize }} />
        </SharedView>
      </View>

      <Animated.View style={bodyAnim}>
        <TouchableOpacity style={[styles.favBtn, isFavourite && styles.favBtnActive]} onPress={toggleFavourite}>
          {isFavourite ? <StarIconSolid size={18} color={colors.textPrimary} /> : <StarIcon size={18} color={colors.accent} />}
          <Text style={[styles.favBtnText, isFavourite && styles.favBtnTextActive]}>
            {isFavourite ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>

        {isLoading ? (
          <CharacterDetailSkeleton />
        ) : isError || !character ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Failed to load character</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.characterName}>{character.name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.dot, { backgroundColor: statusColorMap[character.status as keyof typeof statusColorMap] ?? colors.statusUnknown }]} />
                <Text style={styles.statusText}>{character.status}</Text>
              </View>
              <View style={styles.grid}>
                {[['Species', character.species], ['Gender', character.gender], ['Type', character.type || 'N/A'], ['Origin', character.origin.name], ['Location', character.location.name]].map(([label, value]) => (
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
                data={character.episode} horizontal keyExtractor={item => item}
                renderItem={({ item }) => <EpisodeChip url={item} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 10 }}
              />
            </View>
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
}
