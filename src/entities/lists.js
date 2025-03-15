/* eslint-disable no-undef */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initializeLists = createAsyncThunk(
  'lists/initialize',
  async () => {
    const result = await chrome.storage.local.get([
      'BlackList', 
      'WhiteList', 
      'isBlacklistEnabled', 
      'isWhitelistEnabled'
    ]);
    
    return {
      BlackList: result.BlackList || [],
      WhiteList: result.WhiteList || [],
      isBlacklistEnabled: result.isBlacklistEnabled || false,
      isWhitelistEnabled: result.isWhitelistEnabled || false
    };
  }
);

const parseDomain = (item) => {
  const urlStr = item.startsWith("http") ? item : `http://${item}`;
  const url = new URL(urlStr);
  return url.hostname.replace(/^www\./, "");
};


const safeArray = (data) => 
  Array.isArray(data) ? data : Object.values(data || {});

const listSlice = createSlice({
  name: "listSlice",
  initialState: {
    BlackList: [],
    WhiteList: [],
    isBlacklistEnabled: false,
    isWhitelistEnabled: false,
    initialized: false
  },
  reducers: {addTolist(state, action) {
    const { list, item } = action.payload;
    const domain = parseDomain(item);
    
    const currentList = safeArray(state[list]);
    
    if (!currentList.includes(domain)) {
      currentList.push(domain);
      
      state[list] = currentList;
      
      chrome.storage.local.set({ 
        [list]: [...currentList]
      });
    }
  },
    deleteFromList(state, action) {
      const { list, item } = action.payload;
      state[list] = state[list].filter(d => d !== item);
      chrome.storage.local.set({ [list]: state[list] });
    },

    toggleList(state, action) {
      const { list, value } = action.payload;
      const isBlack = list === 'BlackList';
      
      // Гарантируем взаимоисключающее включение
      state.isBlacklistEnabled = isBlack ? value : false;
      state.isWhitelistEnabled = isBlack ? false : value;
      
      chrome.storage.local.set({
        isBlacklistEnabled: state.isBlacklistEnabled,
        isWhitelistEnabled: state.isWhitelistEnabled
      });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initializeLists.fulfilled, (state, action) => {
      state.BlackList = action.payload.BlackList;
      state.WhiteList = action.payload.WhiteList;
      state.isBlacklistEnabled = action.payload.isBlacklistEnabled;
      state.isWhitelistEnabled = action.payload.isWhitelistEnabled;
      state.initialized = true;
    });
  }
});

export const { addTolist, deleteFromList, toggleList } = listSlice.actions;
export default listSlice.reducer;