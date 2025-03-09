import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	activeTab: localStorage.getItem("activeTab") || "1",
};

const layoutSlice = createSlice({
	name: "layoutSlice",
	initialState,
	reducers: {
		changeTab(state, action) {
			state.activeTab = action.payload;
			localStorage.setItem("activeTab", JSON.stringify(state.activeTab));
		},
	},
});

export const {changeTab} = layoutSlice.actions;

export default layoutSlice.reducer;
