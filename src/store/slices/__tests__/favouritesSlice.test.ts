import { configureStore } from '@reduxjs/toolkit';
import favouritesReducer, {
  loadFavourites,
  addFavourite,
  removeFavouriteById,
} from '../favouritesSlice';
import * as database from '../../../utils/database';
import type { Character } from '../../../types/api';

jest.mock('../../../utils/database');

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Earth', url: '' },
  image: 'https://example.com/rick.png',
  episode: [],
  url: '',
  created: '',
};

function makeStore() {
  return configureStore({ reducer: { favourites: favouritesReducer } });
}

describe('favouritesSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts with empty items and loaded false', () => {
    const store = makeStore();
    expect(store.getState().favourites.items).toEqual([]);
    expect(store.getState().favourites.loaded).toBe(false);
  });

  describe('loadFavourites', () => {
    it('populates items and sets loaded to true on success', async () => {
      (database.getAllFavourites as jest.Mock).mockResolvedValue([mockCharacter]);

      const store = makeStore();
      await store.dispatch(loadFavourites());

      expect(store.getState().favourites.items).toEqual([mockCharacter]);
      expect(store.getState().favourites.loaded).toBe(true);
    });

    it('sets items to empty array when no favourites exist', async () => {
      (database.getAllFavourites as jest.Mock).mockResolvedValue([]);

      const store = makeStore();
      await store.dispatch(loadFavourites());

      expect(store.getState().favourites.items).toHaveLength(0);
      expect(store.getState().favourites.loaded).toBe(true);
    });
  });

  describe('addFavourite', () => {
    it('appends a new character to items', async () => {
      (database.insertFavourite as jest.Mock).mockResolvedValue(undefined);

      const store = makeStore();
      await store.dispatch(addFavourite(mockCharacter));

      expect(store.getState().favourites.items).toContainEqual(mockCharacter);
    });

    it('does not add a duplicate when character already exists', async () => {
      (database.insertFavourite as jest.Mock).mockResolvedValue(undefined);

      const store = makeStore();
      await store.dispatch(addFavourite(mockCharacter));
      await store.dispatch(addFavourite(mockCharacter));

      expect(store.getState().favourites.items).toHaveLength(1);
    });
  });

  describe('removeFavouriteById', () => {
    it('removes the character with the given id', async () => {
      (database.getAllFavourites as jest.Mock).mockResolvedValue([mockCharacter]);
      (database.removeFavourite as jest.Mock).mockResolvedValue(undefined);

      const store = makeStore();
      await store.dispatch(loadFavourites());
      await store.dispatch(removeFavouriteById(mockCharacter.id));

      expect(store.getState().favourites.items).toHaveLength(0);
    });

    it('leaves other items intact when removing one', async () => {
      const second: Character = { ...mockCharacter, id: 2, name: 'Morty Smith' };
      (database.getAllFavourites as jest.Mock).mockResolvedValue([mockCharacter, second]);
      (database.removeFavourite as jest.Mock).mockResolvedValue(undefined);

      const store = makeStore();
      await store.dispatch(loadFavourites());
      await store.dispatch(removeFavouriteById(mockCharacter.id));

      const { items } = store.getState().favourites;
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(2);
    });
  });
});
