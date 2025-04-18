import React from "react";
import styles from "./styles.module.scss";
import {blockedUrls} from "../../shared/consts/urls";
import {useSelector} from "react-redux";

const StatItem = ({stat, totalSeconds}) => {
	const hours = Math.floor(stat.seconds / 3600);
	const minutes = Math.floor((stat.seconds % 3600) / 60);
	const whiteList = useSelector(state => state.listSlyce.WhiteList);

	return (
		<div className={styles.statItem}>
			<div className={styles.right}>
				<div className={styles.imgCont}>
					<img src={`https://www.google.com/s2/favicons?domain=${stat.domain}`} alt='favicon' />
				</div>
				<div className={styles.domain}>{stat.domain}</div>
			</div>
			<div className={styles.left}>
				<div className={styles.bar}>
					<div style={{width: `${(stat.seconds / totalSeconds) * 100}%`, backgroundColor: stat.color}} className={styles.barInner} />
				</div>
				<div>
					{hours > 0 && `${hours}ч `}
					{minutes}м
				</div>
			</div>
		</div>
	);
};

export default React.memo(StatItem);
