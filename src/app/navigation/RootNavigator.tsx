import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  UserGroupIcon, FilmIcon, GlobeAltIcon, StarIcon,
} from 'react-native-heroicons/outline';
import {
  UserGroupIcon as UserGroupIconSolid,
  FilmIcon as FilmIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  StarIcon as StarIconSolid,
} from 'react-native-heroicons/solid';
import { useTheme } from '../../theme/ThemeContext';
import type { RootTabParamList, CharacterStackParamList, LocationStackParamList } from '../../types/navigation';
import CharacterListScreen from '../../features/characters/screens/CharacterListScreen';
import CharacterDetailScreen from '../../features/characters/screens/CharacterDetailScreen';
import EpisodeListScreen from '../../features/episodes/screens/EpisodeListScreen';
import LocationListScreen from '../../features/locations/screens/LocationListScreen';
import LocationDetailScreen from '../../features/locations/screens/LocationDetailScreen';
import FavouritesScreen from '../../features/favourites/screens/FavouritesScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const CharacterStack = createNativeStackNavigator<CharacterStackParamList>();
const LocationStack = createNativeStackNavigator<LocationStackParamList>();

function CharacterStackNavigator() {
  return (
    <CharacterStack.Navigator screenOptions={{ headerShown: false }}>
      <CharacterStack.Screen name="CharacterList" component={CharacterListScreen} />
      <CharacterStack.Screen name="CharacterDetail" component={CharacterDetailScreen} />
    </CharacterStack.Navigator>
  );
}

function LocationStackNavigator() {
  return (
    <LocationStack.Navigator screenOptions={{ headerShown: false }}>
      <LocationStack.Screen name="LocationList" component={LocationListScreen} />
      <LocationStack.Screen name="LocationDetail" component={LocationDetailScreen} />
    </LocationStack.Navigator>
  );
}

const ICON_SIZE = 22;

export default function RootNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceElevated,
          borderTopColor: colors.accent + '55',
          borderTopWidth: 1.5,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDisabled,
        tabBarIcon: ({ focused, color }) => {
          const props = { size: ICON_SIZE, color };
          if (route.name === 'Characters') return focused ? <UserGroupIconSolid {...props} /> : <UserGroupIcon {...props} />;
          if (route.name === 'Episodes') return focused ? <FilmIconSolid {...props} /> : <FilmIcon {...props} />;
          if (route.name === 'Locations') return focused ? <GlobeAltIconSolid {...props} /> : <GlobeAltIcon {...props} />;
          return focused ? <StarIconSolid {...props} /> : <StarIcon {...props} />;
        },
      })}>
      <Tab.Screen name="Characters" component={CharacterStackNavigator} />
      <Tab.Screen name="Episodes" component={EpisodeListScreen} />
      <Tab.Screen name="Locations" component={LocationStackNavigator} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
    </Tab.Navigator>
  );
}
