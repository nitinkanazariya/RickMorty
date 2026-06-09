import React, { useMemo } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity, ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';
import { fetchLocationById } from '../../../services/locationService';
import { fetchCharactersByIds } from '../../../services/characterService';
import LocationDetailSkeleton from '../components/LocationDetailSkeleton';
import { spacing, layout } from '../../../theme';
import type { LocationStackParamList } from '../../../types/navigation';
import type { Character } from '../../../types/api';
import { strings } from '../../../constants/strings';
import { makeStyles } from './LocationDetailScreen.style';

type RouteProp = NativeStackScreenProps<LocationStackParamList, 'LocationDetail'>['route'];
type NavProp = NativeStackNavigationProp<LocationStackParamList>;

export default function LocationDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp>();
  const navigation = useNavigation<NavProp>();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id } = route.params;

  const { data: location, isLoading, isError, refetch } = useQuery({
    queryKey: ['location', id],
    queryFn: () => fetchLocationById(id),
  });

  const residentIds = (location?.residents ?? []).map(u => Number(u.split('/').pop()));
  const { data: residents } = useQuery<Character[]>({
    queryKey: ['residents', residentIds],
    queryFn: () => fetchCharactersByIds(residentIds),
    enabled: residentIds.length > 0,
  });

  if (isLoading) return <LocationDetailSkeleton topInset={insets.top} />;

  if (isError || !location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{strings.locations.errorLoadDetail}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>{strings.common.retry}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const avatarSize = layout.residentColumns >= 5 ? 64 : 80;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.backBtn, { paddingTop: insets.top + spacing.sm, backgroundColor: colors.background }]} onPress={() => navigation.goBack()}>
        <ChevronLeftIcon size={20} color={colors.accent} />
        <Text style={styles.backText}>{strings.common.back}</Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.infoCard}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.type}>{location.type}</Text>
        <Text style={styles.dimension}>{location.dimension}</Text>
        {location.residents.length > 0 && (
          <Text style={styles.residents}>{strings.locations.residents(location.residents.length)}</Text>
        )}
      </View>
      <Text style={styles.sectionTitle}>{strings.locations.residentsSection}</Text>
      {location.residents.length === 0 ? (
        <View style={styles.noResidentsWrap}>
          <Text style={styles.noResidents}>{strings.locations.noResidents}</Text>
        </View>
      ) : (
        <FlatList
          data={residents ?? []}
          keyExtractor={item => String(item.id)}
          numColumns={layout.residentColumns}
          key={`res-${layout.residentColumns}`}
          scrollEnabled={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}
          renderItem={({ item }) => (
            <View style={styles.residentCard}>
              <Image source={{ uri: item.image }} style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} />
              <Text style={styles.residentName} numberOfLines={2}>{item.name}</Text>
            </View>
          )}
        />
      )}
      </ScrollView>
    </View>
  );
}
