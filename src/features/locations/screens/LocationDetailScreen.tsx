import React, { useMemo } from 'react';
import {
  View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';
import type { Colors } from '../../../theme/ThemeContext';
import { fetchLocationById } from '../../../services/locationService';
import { fetchCharactersByIds } from '../../../services/characterService';
import LocationDetailSkeleton from '../components/LocationDetailSkeleton';
import { typography, spacing, radii, layout } from '../../../theme';
import type { LocationStackParamList } from '../../../types/navigation';
import type { Character } from '../../../types/api';
import { strings } from '../../../constants/strings';

type RouteProp = NativeStackScreenProps<LocationStackParamList, 'LocationDetail'>['route'];
type NavProp = NativeStackNavigationProp<LocationStackParamList>;

function makeStyles(c: Colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: c.background },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
    backText: { color: c.accent, fontSize: typography.lg },
    infoCard: {
      margin: spacing.lg, backgroundColor: c.surface,
      borderRadius: radii.xl, padding: spacing.xl, gap: spacing.sm,
    },
    name: { color: c.textPrimary, fontSize: typography.xxxl, fontWeight: '800' },
    type: { color: c.accent, fontSize: typography.base },
    dimension: { color: c.textMuted, fontSize: typography.base },
    residents: { color: c.textDisabled, fontSize: typography.sm, marginTop: spacing.xs },
    sectionTitle: { color: c.textPrimary, fontSize: typography.xl, fontWeight: '700', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    row: { gap: 10, marginBottom: 10 },
    residentCard: { flex: 1, alignItems: 'center' },
    avatar: { backgroundColor: c.surface, marginBottom: spacing.sm },
    residentName: { color: c.textSecondary, fontSize: typography.xs, textAlign: 'center' },
    errorText: { color: c.error, fontSize: typography.lg, marginBottom: spacing.md },
    retryBtn: { backgroundColor: c.accent, paddingHorizontal: spacing.xxl, paddingVertical: 10, borderRadius: radii.sm },
    retryText: { color: c.textPrimary, fontWeight: '600' },
  });
}

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={[styles.backBtn, { paddingTop: insets.top + spacing.sm }]} onPress={() => navigation.goBack()}>
        <ChevronLeftIcon size={20} color={colors.accent} />
        <Text style={styles.backText}>{strings.common.back}</Text>
      </TouchableOpacity>
      <View style={styles.infoCard}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.type}>{location.type}</Text>
        <Text style={styles.dimension}>{location.dimension}</Text>
        {location.residents.length > 0 && (
          <Text style={styles.residents}>{strings.locations.residents(location.residents.length)}</Text>
        )}
      </View>
      {location.residents.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{strings.locations.residentsSection}</Text>
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
        </>
      )}
    </ScrollView>
  );
}
