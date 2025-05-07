import React from "react";
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";
import styles from "./style.module.scss";

const CATEGORY_LABELS = {
	entertainment: "Развлекательные",
	productive: "Рабочие",
	unknown: "Не определено",
};

const CATEGORY_COLORS = {
	entertainment: "rgb(213 7 7)",
	productive: "green",
	unknown: "rgb(255 144 0)",
};

const formatTime = seconds => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return `${hours}ч ${minutes.toString().padStart(2, "0")}м`;
};

const CategoryPieChart = ({categorySummary, totalTimeSec}) => {
	console.log(categorySummary);
	const data = Object.entries(categorySummary)
		.filter(([, value]) => value > 0)
		.map(([key, value]) => ({
			name: CATEGORY_LABELS[key] || key,
			value,
			color: CATEGORY_COLORS[key] || "#ccc",
		}));

	return (
		<div className={styles.flexChart}>
			<div className={styles.sublyTitle}>Общая сводка</div>
			<div className={styles.boxAndLegend}>
				<div className={styles.chartBox}>
					<ResponsiveContainer>
						<PieChart>
							<Pie data={data} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={70} isAnimationActive={false} label={false}>
								{data.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div className={styles.textFlex}>
					<div className={styles.itemChart}>
						<span className={styles.colorBlock} style={{backgroundColor: "#2592ff"}} />
						<span>Всего времени</span>
						<span>{formatTime(totalTimeSec)}</span>
					</div>
					{data.map((entry, index) => (
						<div key={index} className={styles.itemChart}>
							<span className={styles.colorBlock} style={{backgroundColor: entry.color}} />
							<span>{entry.name}</span>
							<span>{formatTime(entry.value)}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CategoryPieChart;
