import {configureStore} from "@reduxjs/toolkit";
import layoutSlice from "../entities/layout";

const store = configureStore({
	reducer: {
		layoutSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
