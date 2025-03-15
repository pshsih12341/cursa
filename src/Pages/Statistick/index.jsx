import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {initializeStats} from "entities/stat";
import StatItem from "./StatItem";
import styles from "./styles.module.scss";

const Statistick = () => {
	const {stats, loaded} = useSelector(state => state.statsSlice);
	const dispatch = useDispatch();
	const currentDate = new Date().toISOString().split("T")[0];
	const todayStats = stats[currentDate] || {};

	useEffect(() => {
		dispatch(initializeStats());
	}, [dispatch]);

	const totalSeconds = Object.values(todayStats).reduce((acc, s) => acc + s, 0);
	const statsArray = Object.entries(todayStats)
		.map(([domain, seconds]) => ({
			id: domain,
			domain,
			seconds,
		}))
		.filter(item => item.seconds >= 60)
		.sort((a, b) => b.seconds - a.seconds);

	console.log(stats);

	if (!loaded) {
		return <div className={styles.container}>Загрузка статистики...</div>;
	}

	return (
		<div className={styles.container}>
			<div className={styles.h}>Статистика за сегодня</div>
			<div className={styles.content}>
				{statsArray.map(stat => (
					<StatItem key={stat.id} stat={stat} totalSeconds={totalSeconds} />
				))}
			</div>
		</div>
	);
};

export default React.memo(Statistick);
