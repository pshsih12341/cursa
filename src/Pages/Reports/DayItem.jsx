import React from "react";

import styles from "./style.module.scss";
import classNames from "classnames";
const formatTime = seconds => {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	return `${hours}ч ${minutes.toString().padStart(2, "0")}м`;
};

const DayItem = ({day}) => {
	return (
		<div className={styles.dayItem}>
			<div className={styles.dayItem__top}>
				<div className={styles.dayItem__block}>
					День
					<div className={styles.dayItem__text}>{day.date.slice(5)}</div>
				</div>
				<div className={styles.dayItem__block}>
					Часы
					<div className={styles.dayItem__time}>
						<div className={styles.timeItem}>
							<div className={classNames(styles.color, styles.colorAll)} />
							<div>{formatTime(day.totalTimeSec)}</div>
						</div>
						<div className={styles.timeItem}>
							<div className={classNames(styles.color, styles.colorEnt)} />
							<div>{formatTime(day.entertainmentSec)}</div>
						</div>
						<div className={styles.timeItem}>
							<div className={classNames(styles.color, styles.colorProd)} />
							<div>{formatTime(day.productiveSec)}</div>
						</div>
						<div className={styles.timeItem}>
							<div className={classNames(styles.color, styles.colorUnk)} />
							<div>{formatTime(day.unknownSec)}</div>
						</div>
					</div>
				</div>
				<div className={styles.dayItem__block}>
					Сайт дня
					<div className={styles.dayItem__site}>
						<div className={styles.site__day}>
							<img src={`https://www.google.com/s2/favicons?sz=64&domain=https://${day.topSite}`} alt='favicon' className={styles.site__icon} />
							<div className={styles.day__topSite}>{day.topSite}</div>
						</div>
						<div className={styles.timeItem}>
							<div
								className={classNames(
									styles.color,
									day.topSiteCategory === "entertainment" ? styles.colorEnt
									: day.topSiteCategory === "productive" ? styles.colorProd
									: styles.colorUnk
								)}
							/>
							<div>{formatTime(day.topSiteTimeSec)}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DayItem;
