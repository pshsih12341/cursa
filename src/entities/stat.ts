import {createSlice} from "@reduxjs/toolkit";

export interface Stat {
	name: string;
	hours: number;
	color: string;
	id: number;
}

const stat: Stat[] = [
	{
		name: "Yandex.com",
		hours: 24,
		color: "yellow",
		id: 1,
	},
	{
		name: "YouTube.com",
		hours: 2,
		color: "red",
		id: 2,
	},
	{
		name: "Instagram.com",
		hours: 3,
		color: "purple",
		id: 3,
	},
	{
		name: "Netflix.com",
		hours: 1,
		color: "black",
		id: 4,
	},
	{
		name: "Twitch.tv",
		hours: 1,
		color: "violet",
		id: 5,
	},
	{
		name: "Reddit.com",
		hours: 2,
		color: "orange",
		id: 6,
	},
	{
		name: "TikTok.com",
		hours: 1,
		color: "pink",
		id: 7,
	},
	{
		name: "Facebook.com",
		hours: 2,
		color: "blue",
		id: 8,
	},
	{
		name: "Twitter.com",
		hours: 6,
		color: "lightblue",
		id: 9,
	},
	{
		name: "VK.com",
		hours: 5,
		color: "lightblue",
		id: 10,
	},
];

const initialState = {
	stats: stat.sort((a, b) => b.hours - a.hours),
};

const statsSlice = createSlice({
	name: "statsSlice",
	initialState,
	reducers: {},
});

export default statsSlice.reducer;
