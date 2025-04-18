/* eslint-disable no-undef */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isScheduleNowActive } from "../shared/utils/isScheduleNowActive";

export const initializeLists = createAsyncThunk(
  'lists/initialize',
  async () => {
    const result = await chrome.storage.local.get([
      'BlackList', 
      'WhiteList', 
      'isBlacklistEnabled', 
      'isWhitelistEnabled',
      'BlackListSchedule',
      'WhiteListSchedule'
    ]);
    
    return {
      BlackList: result.BlackList || [],
      WhiteList: result.WhiteList || [],
      isBlacklistEnabled: result.isBlacklistEnabled || false,
      isWhitelistEnabled: result.isWhitelistEnabled || false,
      BlackListSchedule: result.BlackListSchedule || {},
      WhiteListSchedule: result.WhiteListSchedule || {},
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
    initialized: false,
    BlackListSchedule: {},
    WhiteListSchedule: {}
  },
  reducers: {
    addTolist(state, action) {
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
      const scheduleKey = isBlack ? 'BlackListSchedule' : 'WhiteListSchedule';
    
      // если пользователь хочет ВКЛЮЧИТЬ, но сейчас включено по расписанию — игнорируем
      if (value === true && isScheduleNowActive(state[scheduleKey])) {
        console.warn("Попытка включить вручную, но расписание уже активно — игнорируем.");
        return;
      }
    
      state.isBlacklistEnabled = isBlack ? value : false;
      state.isWhitelistEnabled = isBlack ? false : value;
    
      chrome.storage.local.set({
        isBlacklistEnabled: state.isBlacklistEnabled,
        isWhitelistEnabled: state.isWhitelistEnabled
      });
    },

    updateSchedule(state, action) {
      const { list, days, startTime, endTime } = action.payload;
      const scheduleKey = list === "BlackList" ? "BlackListSchedule" : "WhiteListSchedule";
      state[scheduleKey] = { days, startTime, endTime };
      chrome.storage.local.set({ [scheduleKey]: state[scheduleKey] });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initializeLists.fulfilled, (state, action) => {
      state.BlackList = action.payload.BlackList;
      state.WhiteList = action.payload.WhiteList;
      state.isBlacklistEnabled = action.payload.isBlacklistEnabled;
      state.isWhitelistEnabled = action.payload.isWhitelistEnabled;
      state.BlackListSchedule = action.payload.BlackListSchedule;
      state.WhiteListSchedule = action.payload.WhiteListSchedule;
      state.initialized = true;
    });
  }
});

export const { addTolist, deleteFromList, toggleList,updateSchedule } = listSlice.actions;
export default listSlice.reducer;