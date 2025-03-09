import React from "react";

import styles from "./styles.module.scss";
import {useAppDispatch, useAppSelector} from "shared/hooks/stateHooks";
import {changeTab} from "entities/layout";
import {Tabs} from "antd";
import Statistick from "Pages/Statistick";
import Lists from "Pages/Lists";
import Reports from "Pages/Reports";

const Home: React.FC = () => {
	const dispatch = useAppDispatch();
	const activeTab = useAppSelector(s => s.layoutSlice.activeTab);

	const tabs = [
		{
			key: "1",
			label: <div className={styles.label}>Статистика</div>,
			children: <Statistick />,
		},
		{
			key: "2",
			label: <div className={styles.label}>Листы</div>,
			children: <Lists />,
		},
		{
			key: "3",
			label: <div className={styles.label}>Отчеты</div>,
			children: <Reports />,
		},
	];

	const onChange = (activeKey: string) => {
		dispatch(changeTab(activeKey));
	};
	return (
		<div className={styles.container}>
			<Tabs tabBarStyle={{justifyContent: "space-between", width: "100%", fontSize: "32px"}} centered className={styles.tabs} tabPosition='bottom' defaultActiveKey={activeTab} items={tabs} onChange={k => onChange(k)} />
		</div>
	);
};

export default React.memo(Home);
