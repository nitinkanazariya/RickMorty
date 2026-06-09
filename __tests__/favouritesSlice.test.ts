import { configureStore } from '@reduxjs/toolkit';
import favouritesReducer, {
  addFavourite,
  removeFavouriteById,
  loadFavourites,
} from '../src/store/slices/favouritesSlice';
import type { Character } from '../src/types/api';

jest.mock('../src/utils/database', () => ({
  getAllFavourites: jest.fn().mockResolvedValue([]),
  insertFavourite: jest.fn().mockResolvedValue(undefined),
  removeFavourite: jest.fn().mockResolvedValue(undefined),
}));

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [],
  url: '',
  created: '',
};

function makeStore() {
  return configureStore({ reducer: { favourites: favouritesReducer } });
}

describe('favouritesSlice', () => {
  it('starts with empty items', () => {
    const store = makeStore();
    expect(store.getState().favourites.items).toHaveLength(0);
  });

  it('adds a character to favourites', async () => {
    const store = makeStore();
    await store.dispatch(addFavourite(mockCharacter));
    expect(store.getState().favourites.items).toHaveLength(1);
    expect(store.getState().favourites.items[0].id).toBe(1);
  });

  it('does not add duplicate characters', async () => {
    const store = makeStore();
    await store.dispatch(addFavourite(mockCharacter));
    await store.dispatch(addFavourite(mockCharacter));
    expect(store.getState().favourites.items).toHaveLength(1);
  });

  it('removes a character by id', async () => {
    const store = makeStore();
    await store.dispatch(addFavourite(mockCharacter));
    await store.dispatch(removeFavouriteById(1));
    expect(store.getState().favourites.items).toHaveLength(0);
  });

  it('loads favourites from SQLite on init', async () => {
    const { getAllFavourites } = require('../src/utils/database');
    (getAllFavourites as jest.Mock).mockResolvedValueOnce([mockCharacter]);

    const store = makeStore();
    await store.dispatch(loadFavourites());
    expect(store.getState().favourites.items).toHaveLength(1);
    expect(store.getState().favourites.loaded).toBe(true);
  });
});
