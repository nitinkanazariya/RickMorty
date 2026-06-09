import { configureStore } from '@reduxjs/toolkit';
import favouritesReducer from './slices/favouritesSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    favourites: favouritesReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
