import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Page from "features/Page";
import { Button, Popover, Switch, TimePicker } from "antd";
import List from "./List";
import { useDispatch, useSelector } from "react-redux";
import { toggleList, initializeLists } from "../../entities/lists"; // Импорт санки
import { CalendarOutlined } from "@ant-design/icons";
import sharedStyles from "../../shared/styles/sharedStyles.module.scss";
import ScheduleSelector from "./ScheduleSelector";

const Lists = () => {
  const dispatch = useDispatch();
  const [currentList, setCurrentList] = useState(null);
  
  // Получаем данные из Redux store
  const { 
    isBlacklistEnabled, 
    isWhitelistEnabled, 
    initialized 
  } = useSelector(state => ({
    isBlacklistEnabled: state.listSlyce.isBlacklistEnabled,
    isWhitelistEnabled: state.listSlyce.isWhitelistEnabled,
    initialized: state.listSlyce.initialized
  }));

  // Инициализация данных при монтировании


  const handleToggle = (listType, value) => {
    dispatch(toggleList({ list: listType, value }));
  };

  if (!initialized) {
    return <Page><div className={styles.loading}>Loading...</div></Page>;
  }

  return (
    <>
      {currentList === "BlackList" && <List list="BlackList" setList={setCurrentList} />}
      {currentList === "WhiteList" && <List list="WhiteList" setList={setCurrentList} />}
      
      {!currentList && (<div className={sharedStyles.mainCont}>
			<div className={sharedStyles.header}>Листы</div>
			<div className={sharedStyles.contentCont}>
				<Button onClick={() => setCurrentList("WhiteList")} type='primary' className={styles.btn}>
					Белый список
				</Button>
				<div className={styles.acceptBlock}>
					<div className={styles.textRight}>
						<div>{isWhitelistEnabled ? "Отключить" : "Включить"}</div>
						<div>Белый список</div>
					</div>
					<div className={styles.left}>
						<Switch checked={isWhitelistEnabled} 
                  onChange={checked => handleToggle("WhiteList", checked)} />
						<Popover trigger={"click"} content={<ScheduleSelector listType={"WhiteList"}/>}>
							<Button type='primary' className={styles.calenderBtn}>
								<CalendarOutlined />
							</Button>
						</Popover>
					</div>
				</div>
				<Button onClick={() => setCurrentList("BlackList")} type='primary' className={styles.btn}>
					Черный список
				</Button>
				<div className={styles.acceptBlock}>
					<div className={styles.textRight}>
						<div>{isBlacklistEnabled ? "Отключить" : "Включить"}</div>
						<div>Черный список</div>
					</div>
					<div className={styles.left}>
						<Switch  checked={isBlacklistEnabled} 
                  onChange={checked => handleToggle("BlackList", checked)} />
						<Popover trigger={"click"} content={<ScheduleSelector listType={"BlackList"}/>}>
							<Button type='primary' className={styles.calenderBtn}>
								<CalendarOutlined />
							</Button>
						</Popover>
					</div>
				</div>
			</div>
		</div>)}
    </>
  );
};

export default React.memo(Lists);