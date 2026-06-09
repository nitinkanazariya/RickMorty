import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  characterFilters: {
    status: string;
    gender: string;
  };
  activeTab: string;
}

const initialState: UIState = {
  characterFilters: {
    status: '',
    gender: '',
  },
  activeTab: 'Characters',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<string>) {
      state.characterFilters.status = action.payload;
    },
    setGenderFilter(state, action: PayloadAction<string>) {
      state.characterFilters.gender = action.payload;
    },
    clearFilters(state) {
      state.characterFilters = { status: '', gender: '' };
    },
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setStatusFilter, setGenderFilter, clearFilters, setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
