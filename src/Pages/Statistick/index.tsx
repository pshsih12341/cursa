import React from "react";
import {useAppSelector} from "shared/hooks/stateHooks";
import styles from "./styles.module.scss";
import StatItem from "./StatItem";

const Statistick: React.FC = () => {
	const stat = useAppSelector(s => s.statsSlice.stats);

	return (
		<div className={styles.container}>
			<div className={styles.h}>Статистика</div>
			<div className={styles.content}>
				{stat.map(el => (
					<StatItem key={el.id} statItem={el} />
				))}
			</div>
		</div>
	);
};

export default React.memo(Statistick);
