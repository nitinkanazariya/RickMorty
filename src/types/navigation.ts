export type RootTabParamList = {
  Characters: undefined;
  Episodes: undefined;
  Locations: undefined;
  Favourites: undefined;
};

export type CharacterStackParamList = {
  CharacterList: undefined;
  CharacterDetail: { id: number };
};

export type EpisodeStackParamList = {
  EpisodeList: undefined;
};

export type LocationStackParamList = {
  LocationList: undefined;
  LocationDetail: { id: number };
};
