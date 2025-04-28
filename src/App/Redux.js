import {configureStore} from "@reduxjs/toolkit";
import layoutSlice from "../entities/layout";
import statsSlice from "../entities/stat";
import listSlyce from "../entities/lists";
import reportSlice from "../entities/reporst";

const store = configureStore({
	reducer: {
		layoutSlice,
		statsSlice,
		listSlyce,
		reportSlice,
	},
});

export default store;
