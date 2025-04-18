/* eslint-disable no-undef */
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
	activeTab: "1",
	ruleAccept: false,
};

export const initializeUser = createAsyncThunk("layout/initialize", async () => {
	const result = await chrome.storage.local.get(["activeTab", "ruleAccept"]);

	return {
		activeTab: result.activeTab || 1,
		ruleAccept: result.ruleAccept || false,
	};
});

const layoutSlice = createSlice({
	name: "layoutSlice",
	initialState,
	reducers: {
		changeTab(state, action) {
			state.activeTab = action.payload;
		},
		ruleAccepted(state, action) {
			chrome.storage.local.set({ ruleAccept: action.payload });
			state.ruleAccept = action.payload;
		},
	},
	extraReducers: builder => {
		builder.addCase(initializeUser.fulfilled, (state, action) => {
			state.activeTab = action.payload.activeTab;
			state.ruleAccept = action.payload.ruleAccept;
		});
	},
});

export const {changeTab, ruleAccepted} = layoutSlice.actions;

export default layoutSlice.reducer;
