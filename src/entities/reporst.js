import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const initializeReports = createAsyncThunk(
  'reports/initialize',
  async () => {
    // eslint-disable-next-line no-undef
    const { reports } = await chrome.storage.local.get('reports');
    return reports || [];
  }
);

const reportSlice = createSlice({
  name: 'reportSlice',
  initialState: {
    reports: [],
    activeReport: null
  },
  reducers: {
    setActiveReport: (state, action) => {
      state.activeReport = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initializeReports.fulfilled, (state, action) => {
      state.reports = action.payload;
    });
  }
});

export const { setActiveReport } = reportSlice.actions;
export default reportSlice.reducer;