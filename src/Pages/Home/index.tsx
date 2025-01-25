import React from "react";

import styles from "./styles.module.scss";
import {useAppDispatch, useAppSelector} from "shared/hooks/stateHooks";
import {changeTab} from "entities/layout";
import {Tabs} from "antd";

const Home: React.FC = () => {
	const dispatch = useAppDispatch();
	const activeTab = useAppSelector(s => s.layoutSlice.activeTab);

	const tabs = [
		{
			key: "1",
			label: "Tab 1",
			children: "Content of Tab Pane 1",
		},
		{
			key: "2",
			label: "Tab 2",
			children: "Content of Tab Pane 2",
		},
		{
			key: "3",
			label: "Tab 3",
			children: <div>Content of Tab Pane 3</div>,
		},
	];

	const onChange = (activeKey: string) => {
		dispatch(changeTab(activeKey));
	};
	return (
		<div className={styles.container}>
			<Tabs tabPosition='bottom' defaultActiveKey={activeTab} items={tabs} onChange={k => onChange(k)} />
		</div>
	);
};

export default React.memo(Home);
