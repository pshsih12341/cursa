import {configureStore} from "@reduxjs/toolkit";
import layoutSlice from "../entities/layout";
import statsSlice from "../entities/stat";
import listSlyce from "../entities/lists";

const store = configureStore({
	reducer: {
		layoutSlice,
		statsSlice,
		listSlyce,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
