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
import { initializeUser } from "../../entities/layout";
import Page from "../../features/Page";
import classNames from "classnames";


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
	  dispatch(initializeUser());
	  const handleMessage = (message) => {
		if (message.type === 'SWITCH_TAB') {
		  dispatch(changeTab('3'));
		  dispatch(setActiveReport(message.payload.reportId));
		}
	};
		chrome.runtime.onMessage.addListener(handleMessage);
		chrome.runtime.onMessage.addListener(handleStorageUpdate);
		return () => {
			chrome.runtime.onMessage.removeListener(handleStorageUpdate);
			chrome.runtime.onMessage.removeListener(handleMessage);}
	  }, [dispatch]);


	  const tabs = [
		{
			key: "1",
			label: (
				<div className={classNames(styles.label, activeTab === "1" && styles.active)}>
					<div className={classNames(styles.img, styles.statImg)} />
					Статистика
				</div>
			),
			children: <Statistick />,
		},
		{
			key: "2",
			label: (
				<div className={classNames(styles.label, activeTab === "2" && styles.active)}>
					<div className={classNames(styles.img, styles.listImg)} />
					Листы
				</div>
			),
			children: <Lists />,
		},
		{
			key: "3",
			label: (
				<div className={classNames(styles.label, activeTab === "3" && styles.active)}>
					<div className={classNames(styles.img, styles.reportsImg)} />
					Отчеты
				</div>
			),
			children: <Reports />,
		},
	];

	const onChange = (activeKey) => {
		dispatch(changeTab(activeKey));
	};

	console.log()
	return (
		<Page>
			<Tabs tabBarStyle={{justifyContent: "space-between", width: "100%", fontSize: "32px"}} centered className={styles.tabs} tabPosition='bottom' defaultActiveKey={activeTab} items={tabs} onChange={k => onChange(k)} />
		</Page>
	);
};

export default React.memo(Home);