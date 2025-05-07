import React from "react";
import styles from "./styles.module.scss";
import {blockedUrls} from "../../shared/consts/urls";
import {useSelector} from "react-redux";
import classNames from "classnames";

const StatItem = ({stat, totalSeconds, number = undefined}) => {
	const hours = Math.floor(stat.seconds / 3600);
	const minutes = Math.floor((stat.seconds % 3600) / 60);
	console.log(stat, totalSeconds);

	return (
		<div className={styles.statItem}>
			<div className={styles.right}>
				{number}
				<div className={classNames(styles.imgCont, number && styles.isReport)}>
					<img src={`https://www.google.com/s2/favicons?sz=64&domain=https://${stat.domain}`} alt='favicon' />
				</div>
				<div className={styles.domain}>{stat.domain}</div>
			</div>
			<div className={styles.left}>
				<div className={styles.bar}>
					<div
						style={
							number ?
								{
									width: `${(stat.seconds / totalSeconds) * 100}%`,
									backgroundColor:
										stat.category === "productive" ? "green"
										: stat.category === "entertainment" ? "rgb(213 7 7)"
										: "rgb(255 144 0)",
								}
							:	{width: `${(stat.seconds / totalSeconds) * 100}%`, backgroundColor: stat.color}
						}
						className={styles.barInner}
					/>
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
