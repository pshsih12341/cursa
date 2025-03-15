/* eslint-disable no-undef */
import React, { useEffect } from "react";

import styles from "./styles.module.scss";
import {changeTab} from "entities/layout";
import {Tabs} from "antd";
import Statistick from "Pages/Statistick";
import Lists from "Pages/Lists";
import Reports from "Pages/Reports";
import { useDispatch, useSelector } from "react-redux";
import { initializeStats } from "../../entities/stat"; 
import { initializeLists } from "../../entities/lists";


const Home = () => {
	const dispatch = useDispatch();
	const activeTab = useSelector(s => s.layoutSlice.activeTab);
  
	useEffect(() => {
		const handleStorageUpdate = (message) => {
		  if (message.type === 'STORAGE_UPDATED') {
			dispatch(initializeStats.fulfilled(message.stats));
		  }
		};
	  dispatch(initializeLists());
		chrome.runtime.onMessage.addListener(handleStorageUpdate);
		return () => chrome.runtime.onMessage.removeListener(handleStorageUpdate);
	  }, [dispatch]);


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

	const onChange = (activeKey) => {
		dispatch(changeTab(activeKey));
	};
	return (
		<div className={styles.container}>
			<Tabs tabBarStyle={{justifyContent: "space-between", width: "100%", fontSize: "32px"}} centered className={styles.tabs} tabPosition='bottom' defaultActiveKey={activeTab} items={tabs} onChange={k => onChange(k)} />
		</div>
	);
};

export default React.memo(Home);