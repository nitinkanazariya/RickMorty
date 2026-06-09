import React, { Suspense, lazy } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import type { RootTabParamList, CharacterStackParamList, LocationStackParamList } from '../../types/navigation';

const CharacterListScreen = lazy(() => import('../../features/characters/screens/CharacterListScreen'));
const CharacterDetailScreen = lazy(() => import('../../features/characters/screens/CharacterDetailScreen'));
const EpisodeListScreen = lazy(() => import('../../features/episodes/screens/EpisodeListScreen'));
const LocationListScreen = lazy(() => import('../../features/locations/screens/LocationListScreen'));
const LocationDetailScreen = lazy(() => import('../../features/locations/screens/LocationDetailScreen'));
const FavouritesScreen = lazy(() => import('../../features/favourites/screens/FavouritesScreen'));

const Tab = createBottomTabNavigator<RootTabParamList>();
const CharacterStack = createNativeStackNavigator<CharacterStackParamList>();
const LocationStack = createNativeStackNavigator<LocationStackParamList>();

const TAB_ICONS: Record<string, string> = {
  Characters: '👾',
  Episodes: '🎬',
  Locations: '🌍',
  Favourites: '⭐',
};

function FallbackLoader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#00b4d8" />
    </View>
  );
}

function CharacterStackNavigator() {
  return (
    <CharacterStack.Navigator screenOptions={{ headerShown: false }}>
      <CharacterStack.Screen name="CharacterList">
        {() => (
          <Suspense fallback={<FallbackLoader />}>
            <CharacterListScreen />
          </Suspense>
        )}
      </CharacterStack.Screen>
      <CharacterStack.Screen name="CharacterDetail">
        {() => (
          <Suspense fallback={<FallbackLoader />}>
            <CharacterDetailScreen />
          </Suspense>
        )}
      </CharacterStack.Screen>
    </CharacterStack.Navigator>
  );
}

function LocationStackNavigator() {
  return (
    <LocationStack.Navigator screenOptions={{ headerShown: false }}>
      <LocationStack.Screen name="LocationList">
        {() => (
          <Suspense fallback={<FallbackLoader />}>
            <LocationListScreen />
          </Suspense>
        )}
      </LocationStack.Screen>
      <LocationStack.Screen name="LocationDetail">
        {() => (
          <Suspense fallback={<FallbackLoader />}>
            <LocationDetailScreen />
          </Suspense>
        )}
      </LocationStack.Screen>
    </LocationStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#00b4d8',
        tabBarInactiveTintColor: '#6b7280',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]}
          </Text>
        ),
      })}>
      <Tab.Screen name="Characters" component={CharacterStackNavigator} />
      <Tab.Screen name="Episodes">
        {() => (
          <Suspense fallback={<FallbackLoader />}>
            <EpisodeListScreen />
          </Suspense>
        )}
      </Tab.Screen>
      <Tab.Screen name="Locations" component={LocationStackNavigator} />
      <Tab.Screen name="Favourites">
        {() => (
          <Suspense fallback={<FallbackLoader />}>
            <FavouritesScreen />
          </Suspense>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
  },
  tabBar: {
    backgroundColor: '#1a1a2e',
    borderTopColor: '#16213e',
    height: 60,
    paddingBottom: 8,
  },
});
