import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '../../types/api';
import { getAllFavourites, insertFavourite, removeFavourite } from '../../utils/database';

interface FavouritesState {
  items: Character[];
  loaded: boolean;
}

const initialState: FavouritesState = {
  items: [],
  loaded: false,
};

export const loadFavourites = createAsyncThunk('favourites/load', async () => {
  return await getAllFavourites();
});

export const addFavourite = createAsyncThunk('favourites/add', async (character: Character) => {
  await insertFavourite(character);
  return character;
});

export const removeFavouriteById = createAsyncThunk('favourites/remove', async (id: number) => {
  await removeFavourite(id);
  return id;
});

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadFavourites.fulfilled, (state, action: PayloadAction<Character[]>) => {
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(addFavourite.fulfilled, (state, action: PayloadAction<Character>) => {
        const exists = state.items.some(c => c.id === action.payload.id);
        if (!exists) state.items.push(action.payload);
      })
      .addCase(removeFavouriteById.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export default favouritesSlice.reducer;
