import React, { useRef } from 'react';
import type { SvgProps } from 'react-native-svg';

type IconComponent = React.FC<SvgProps & { size?: number; color?: string }>;
import { View, TouchableOpacity, Animated, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useTabBar } from '../../context/TabBarContext';
import { layout } from '../../theme';
import type { RootTabParamList, CharacterStackParamList, LocationStackParamList } from '../../types/navigation';
import CharacterListScreen from '../../features/characters/screens/CharacterListScreen';
import CharacterDetailScreen from '../../features/characters/screens/CharacterDetailScreen';
import EpisodeListScreen from '../../features/episodes/screens/EpisodeListScreen';
import LocationListScreen from '../../features/locations/screens/LocationListScreen';
import LocationDetailScreen from '../../features/locations/screens/LocationDetailScreen';
import FavouritesScreen from '../../features/favourites/screens/FavouritesScreen';
import { styles } from './RootNavigator.style';

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

const ICON_SIZE = 24;

const TAB_ICONS: Record<string, { outline: IconComponent; solid: IconComponent }> = {
  Characters: { outline: UserGroupIcon, solid: UserGroupIconSolid },
  Episodes:   { outline: FilmIcon,      solid: FilmIconSolid      },
  Locations:  { outline: GlobeAltIcon,  solid: GlobeAltIconSolid  },
  Favourites: { outline: StarIcon,      solid: StarIconSolid      },
};

function AnimatedTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, shadows } = useTheme();
  const { tabBarTranslate } = useTabBar();
  const insets = useSafeAreaInsets();

  const scales = useRef(state.routes.map(() => new Animated.Value(1))).current;

  const handlePress = (route: typeof state.routes[number], index: number, focused: boolean) => {
    Animated.sequence([
      Animated.spring(scales[index], {
        toValue: 1.35,
        useNativeDriver: true,
        friction: 4,
        tension: 300,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 200,
      }),
    ]).start();

    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!focused && !event.defaultPrevented) navigation.navigate(route.name as keyof RootTabParamList);
  };

  return (
    <Animated.View
      style={[
        styles.bar,
        shadows.card,
        {
          height: layout.tabBarHeight + insets.bottom + (Platform.OS === 'android' ? 24 : 10),
          paddingBottom: Platform.OS === 'android' ? 10 : insets.bottom,
          paddingTop: Platform.OS === 'android' ? 14 : 10,
          backgroundColor: colors.surfaceElevated,
          transform: [{ translateY: tabBarTranslate }],
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_ICONS[route.name];
        const Icon = focused ? meta.solid : meta.outline;
        const color = focused ? colors.accent : colors.textMuted;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.item}
            onPress={() => handlePress(route, index, focused)}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.iconWrap,
                focused && { backgroundColor: colors.accent + '18' },
                { transform: [{ scale: scales[index] }] },
              ]}
            >
              <Icon size={ICON_SIZE} color={color} />
            </Animated.View>
            {focused && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Characters" component={CharacterStackNavigator} />
      <Tab.Screen name="Episodes" component={EpisodeListScreen} />
      <Tab.Screen name="Locations" component={LocationStackNavigator} />
      <Tab.Screen name="Favourites" component={FavouritesScreen} />
    </Tab.Navigator>
  );
}
