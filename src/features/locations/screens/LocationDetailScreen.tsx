import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchLocationById } from '../../../services/locationService';
import { fetchCharactersByIds } from '../../../services/characterService';
import { colors, typography, spacing, radii, layout } from '../../../theme';
import type { LocationStackParamList } from '../../../types/navigation';
import type { Character } from '../../../types/api';

type RouteProp = NativeStackScreenProps<LocationStackParamList, 'LocationDetail'>['route'];
type NavProp = NativeStackNavigationProp<LocationStackParamList>;

export default function LocationDetailScreen() {
  const route = useRoute<RouteProp>();
  const navigation = useNavigation<NavProp>();
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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (isError || !location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load location</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const avatarSize = layout.residentColumns === 5 ? 64 : 80;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.type}>{location.type}</Text>
        <Text style={styles.dimension}>{location.dimension}</Text>
        <Text style={styles.residents}>{location.residents.length} residents</Text>
      </View>

      <Text style={styles.sectionTitle}>Residents</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  backBtn: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  backText: { color: colors.accent, fontSize: typography.lg },
  infoCard: {
    margin: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  name: { color: colors.textPrimary, fontSize: typography.xxxl, fontWeight: '800' },
  type: { color: colors.accent, fontSize: typography.base },
  dimension: { color: colors.textMuted, fontSize: typography.base },
  residents: { color: colors.textDisabled, fontSize: typography.sm, marginTop: spacing.xs },
  sectionTitle: { color: colors.textPrimary, fontSize: typography.xl, fontWeight: '700', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  row: { gap: 10, marginBottom: 10 },
  residentCard: { flex: 1, alignItems: 'center' },
  avatar: { backgroundColor: colors.surface, marginBottom: spacing.sm },
  residentName: { color: colors.textSecondary, fontSize: typography.xs, textAlign: 'center' },
  errorText: { color: colors.error, fontSize: typography.lg, marginBottom: spacing.md },
  retryBtn: { backgroundColor: colors.accent, paddingHorizontal: spacing.xxl, paddingVertical: 10, borderRadius: radii.sm },
  retryText: { color: colors.textPrimary, fontWeight: '600' },
});
