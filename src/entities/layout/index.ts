import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	activeTab: "1",
};

const layoutSlice = createSlice({
	name: "layoutSlice",
	initialState,
	reducers: {
		changeTab(state, action) {
			state.activeTab = action.payload;
		},
	},
});

export const {changeTab} = layoutSlice.actions;

export default layoutSlice.reducer;
