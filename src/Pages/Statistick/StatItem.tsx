import React from "react";

import styels from "./styles.module.scss";
import {Stat} from "entities/stat";

const StatItem: React.FC<{statItem: Stat}> = ({statItem}) => {
	const getFaviconUrl = (domain: string): string => {
		return `https://www.${domain}/favicon.ico`;
	};

	return (
		<div className={styels.item}>
			<img src={getFaviconUrl(statItem.name)} alt='logo' className={styels.logo} />
			<div className={styels.name}>{statItem.name}</div>
			<div className={styels.line}>
				<div className={styels.color} style={{backgroundColor: statItem.color, width: `calc(100%/24 *${statItem.hours})`}}></div>
			</div>
			<div className={styels.hours}>{statItem.hours}ч</div>
		</div>
	);
};

export default React.memo(StatItem);
