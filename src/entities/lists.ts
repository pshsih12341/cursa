import {createSlice} from "@reduxjs/toolkit";

const BlackList: string[] = ["vk.com", "youtube.com"];
const WhiteList: string[] = ["vk.com", "youtube.com"];

const initialState = {
	BlackList: (JSON.parse(localStorage.getItem("BlackList") || "[]") as string[]) || BlackList,
	WhiteList: (JSON.parse(localStorage.getItem("WhiteList") || "[]") as string[]) || WhiteList,
};

const parseDomain = (item: string): string => {
	const urlStr = item.startsWith("http") ? item : `http://${item}`;
	const url = new URL(urlStr);
	return url.hostname.replace(/^www\./, "");
};

const listSlice = createSlice({
	name: "listSlice",
	initialState,
	reducers: {
		addTolist(state, action: {payload: {item: string; list: "BlackList" | "WhiteList"}}) {
			if (state[action.payload.list].includes(parseDomain(action.payload.item))) return;
			state[action.payload.list].push(parseDomain(action.payload.item));
			localStorage.setItem(action.payload.list, JSON.stringify(state[action.payload.list]));
		},

		deleteFromList(state, action: {payload: {item: string; list: "BlackList" | "WhiteList"}}) {
			state[action.payload.list] = state[action.payload.list].filter(item => item !== action.payload.item);
			localStorage.setItem(action.payload.list, JSON.stringify(state[action.payload.list]));
		},
	},
});

export const {addTolist, deleteFromList} = listSlice.actions;

export default listSlice.reducer;
