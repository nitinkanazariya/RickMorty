import type { NavigatorScreenParams } from '@react-navigation/native';
import type { Character } from './api';

export type RootTabParamList = {
  Characters: NavigatorScreenParams<CharacterStackParamList> | undefined;
  Episodes: undefined;
  Locations: undefined;
  Favourites: undefined;
};

export type CharacterStackParamList = {
  CharacterList: undefined;
  CharacterDetail: { id: number; image: string; character?: Character };
};

export type EpisodeStackParamList = {
  EpisodeList: undefined;
};

export type LocationStackParamList = {
  LocationList: undefined;
  LocationDetail: { id: number };
};
