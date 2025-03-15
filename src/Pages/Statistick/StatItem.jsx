import React from "react";
import styles from "./styles.module.scss";
import {blockedUrls} from "../../shared/consts/urls";
import {useSelector} from "react-redux";

const StatItem = ({stat, totalSeconds}) => {
	const hours = Math.floor(stat.seconds / 3600);
	const minutes = Math.floor((stat.seconds % 3600) / 60);
	const whiteList = useSelector(state => state.listSlyce.WhiteList);

	return (
		<div className={styles.item}>
			<div className={styles.domain}>
				<img src={`https://www.google.com/s2/favicons?domain=${stat.domain}`} alt='favicon' className={styles.favicon} />
				{stat.domain}
			</div>
			<div className={styles.progress}>
				<div
					className={styles.bar}
					style={{
						width: `${(stat.seconds / totalSeconds) * 100}%`,
						backgroundColor: `${
							whiteList.includes(stat.domain) ? "green"
							: blockedUrls.includes(stat.domain) ? "red"
							: "yellow"
						}`,
					}}
				/>
			</div>
			<div className={styles.time}>
				{hours > 0 && `${hours}ч `}
				{minutes}м
			</div>
		</div>
	);
};

export default React.memo(StatItem);
