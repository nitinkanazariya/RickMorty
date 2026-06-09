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
        <ActivityIndicator size="large" color="#00b4d8" />
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
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View style={styles.residentCard}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <Text style={styles.residentName} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' },
  backBtn: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backText: { color: '#00b4d8', fontSize: 16 },
  infoCard: {
    margin: 16,
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 20,
    gap: 6,
  },
  name: { color: '#fff', fontSize: 22, fontWeight: '800' },
  type: { color: '#00b4d8', fontSize: 14 },
  dimension: { color: '#9ca3af', fontSize: 14 },
  residents: { color: '#6b7280', fontSize: 13, marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  row: { gap: 10, marginBottom: 10 },
  residentCard: { flex: 1, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#16213e', marginBottom: 6 },
  residentName: { color: '#d1d5db', fontSize: 11, textAlign: 'center' },
  errorText: { color: '#ef4444', fontSize: 16, marginBottom: 12 },
  retryBtn: { backgroundColor: '#00b4d8', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});
