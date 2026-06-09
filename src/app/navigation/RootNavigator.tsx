import React, { Suspense, lazy } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import {
  UserGroupIcon,
  FilmIcon,
  GlobeAltIcon,
  StarIcon,
} from 'react-native-heroicons/outline';
import {
  UserGroupIcon as UserGroupIconSolid,
  FilmIcon as FilmIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  StarIcon as StarIconSolid,
} from 'react-native-heroicons/solid';
import { colors } from '../../theme';
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

function FallbackLoader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.accent} />
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

const ICON_SIZE = 22;

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDisabled,
        tabBarIcon: ({ focused, color }) => {
          const props = { size: ICON_SIZE, color };
          if (route.name === 'Characters') {
            return focused ? <UserGroupIconSolid {...props} /> : <UserGroupIcon {...props} />;
          }
          if (route.name === 'Episodes') {
            return focused ? <FilmIconSolid {...props} /> : <FilmIcon {...props} />;
          }
          if (route.name === 'Locations') {
            return focused ? <GlobeAltIconSolid {...props} /> : <GlobeAltIcon {...props} />;
          }
          return focused ? <StarIconSolid {...props} /> : <StarIcon {...props} />;
        },
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
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.surfaceElevated,
    borderTopColor: colors.surface,
    height: 60,
    paddingBottom: 8,
  },
});
