import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Character } from '../types/api';

const FAVOURITES_KEY = 'favourites';

export const initDatabase = async (): Promise<void> => {
  const existing = await AsyncStorage.getItem(FAVOURITES_KEY);
  if (existing === null) {
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify([]));
  }
};

export const getAllFavourites = async (): Promise<Character[]> => {
  const data = await AsyncStorage.getItem(FAVOURITES_KEY);
  if (!data) return [];
  return JSON.parse(data) as Character[];
};

export const insertFavourite = async (character: Character): Promise<void> => {
  const current = await getAllFavourites();
  const exists = current.some(c => c.id === character.id);
  if (!exists) {
    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify([...current, character]));
  }
};

export const removeFavourite = async (id: number): Promise<void> => {
  const current = await getAllFavourites();
  await AsyncStorage.setItem(
    FAVOURITES_KEY,
    JSON.stringify(current.filter(c => c.id !== id)),
  );
};
