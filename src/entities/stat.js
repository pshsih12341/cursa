/* eslint-disable no-undef */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  stats: {},
  loaded: false
};

export const initializeStats = createAsyncThunk(
  'stats/initialize',
  async () => {
    const { stats } = await chrome.storage.local.get('stats');
    return stats || {};
  }
);

export const watchStats = () => (dispatch) => {
  const listener = (changes) => {
    if (changes.stats?.newValue) {
      dispatch(initializeStats.fulfilled(changes.stats.newValue));
    }
  };
  
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
};

const statsSlice = createSlice({
  name: 'statsSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeStats.fulfilled, (state, action) => {
      state.stats = action.payload;
      state.loaded = true;
    });
  }
});

export default statsSlice.reducer;