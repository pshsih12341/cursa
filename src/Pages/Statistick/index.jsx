import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {initializeStats} from "entities/stat";
import StatItem from "./StatItem";
import styles from "./styles.module.scss";
import sharedStyles from "../../shared/styles/sharedStyles.module.scss";
import {blockedUrls} from "../../shared/consts/urls";

const Statistick = () => {
	const {stats, loaded} = useSelector(state => state.statsSlice);
	const whiteList = useSelector(state => state.listSlyce.WhiteList);
	const blackList = useSelector(state => state.listSlyce.BlackList);
	const dispatch = useDispatch();
	const currentDate = new Date().toISOString().split("T")[0];
	const todayStats = stats[currentDate] || {};

	useEffect(() => {
		dispatch(initializeStats());
	}, [dispatch]);

	const totalSeconds = Object.values(todayStats).reduce((acc, s) => acc + s, 0);
	const statsArray = Object.entries(todayStats)
		.map(([domain, seconds]) => {
			let color = "rgb(213 7 7)";
			if (blockedUrls.includes(domain) || blackList.includes(domain)) {
				color = "rgb(255 144 0)";
			} else if (whiteList.includes(domain)) {
				color = "green";
			}
			return {id: domain, domain, seconds, color};
		})
		.filter(item => item.seconds >= 60)
		.sort((a, b) => b.seconds - a.seconds);

	console.log(stats);

	if (!loaded) {
		return <div className={styles.container}>Загрузка статистики...</div>;
	}

	return (
		<div className={sharedStyles.mainCont}>
			<div className={sharedStyles.header}>{`Статистика\nза сутки`}</div>
			<div className={sharedStyles.contentCont}>
				{statsArray.map(st => (
					<StatItem key={st.id} stat={st} totalSeconds={totalSeconds} />
				))}
			</div>
		</div>
	);
};

export default React.memo(Statistick);
