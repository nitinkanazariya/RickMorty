import React, { useRef, useEffect, useMemo } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  FlatList, Animated,
} from 'react-native';
import { useToast } from '../../../context/ToastContext';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeftIcon, StarIcon } from 'react-native-heroicons/outline';
import { StarIcon as StarIconSolid } from 'react-native-heroicons/solid';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';
import { fetchCharacterById } from '../../../services/characterService';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppDispatch';
import { addFavourite, removeFavouriteById } from '../../../store/slices/favouritesSlice';
import EpisodeChip from '../components/EpisodeChip';
import CharacterDetailSkeleton from '../components/CharacterDetailSkeleton';
import { spacing, layout } from '../../../theme';
import type { CharacterStackParamList } from '../../../types/navigation';
import { strings } from '../../../constants/strings';
import { makeStyles } from './CharacterDetailScreen.style';

type RouteProp = NativeStackScreenProps<CharacterStackParamList, 'CharacterDetail'>['route'];
type NavProp = NativeStackNavigationProp<CharacterStackParamList>;

const SharedView = View as React.ComponentType<React.ComponentProps<typeof View> & { sharedTransitionTag?: string }>;

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
  const starScale = useRef(new Animated.Value(1)).current;
  const { id, image, character: cachedCharacter } = route.params;
  const { showToast } = useToast();

  const favourites = useAppSelector(s => s.favourites.items);
  const isFavourite = favourites.some(c => c.id === id);

  const { data: character, isLoading, isError, refetch } = useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacterById(id),
    initialData: cachedCharacter,
    staleTime: cachedCharacter ? 5 * 60 * 1000 : 0,
  });

  const toggleFavourite = () => {
    if (!character) return;
    Animated.sequence([
      Animated.timing(starScale, { toValue: 1.45, duration: 120, useNativeDriver: true }),
      Animated.timing(starScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(starScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    const adding = !isFavourite;
    if (adding) dispatch(addFavourite(character));
    else dispatch(removeFavouriteById(id));
    showToast(
      adding ? strings.favourites.toastAdded : strings.favourites.toastRemoved,
      adding ? 'add' : 'remove',
    );
  };

  const statusColorMap = { Alive: colors.statusAlive, Dead: colors.statusDead, unknown: colors.statusUnknown };
  const headerAnim = useEntrance(80);
  const bodyAnim = useEntrance(200);
  const avatarSize = layout.detailAvatarSize;

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm, backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={20} color={colors.accent} />
          <Text style={styles.backText}>{strings.common.back}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavourite} style={styles.starBtn}>
          <Animated.View style={{ transform: [{ scale: starScale }] }}>
            {isFavourite
              ? <StarIconSolid size={28} color={colors.accent} />
              : <StarIcon size={28} color={colors.textDisabled} />}
          </Animated.View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.imageWrapper}>
        <SharedView sharedTransitionTag={`char-img-${id}`} style={[styles.avatarRing, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
          <Image source={{ uri: image }} style={{ width: avatarSize, height: avatarSize }} />
        </SharedView>
      </View>

      <Animated.View style={bodyAnim}>
        {isLoading ? (
          <CharacterDetailSkeleton />
        ) : isError || !character ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{strings.characters.errorLoadDetail}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
              <Text style={styles.retryText}>{strings.common.retry}</Text>
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
                {[[strings.characters.labelSpecies, character.species], [strings.characters.labelGender, character.gender], [strings.characters.labelType, character.type || strings.common.na], [strings.characters.labelOrigin, character.origin.name], [strings.characters.labelLocation, character.location.name]].map(([label, value]) => (
                  <View key={label} style={styles.gridItem}>
                    <Text style={styles.gridLabel}>{label}</Text>
                    <Text style={styles.gridValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.episodesSection}>
              <Text style={styles.sectionTitle}>{strings.characters.episodes(character.episode.length)}</Text>
              <FlatList
                data={character.episode}
                keyExtractor={item => item}
                renderItem={({ item }) => <EpisodeChip url={item} />}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: spacing.xxxl }}
              />
            </View>
          </>
        )}
      </Animated.View>
      </ScrollView>
    </View>
  );
}
