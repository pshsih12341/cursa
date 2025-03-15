import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Page from "features/Page";
import { Button, Switch } from "antd";
import List from "./List";
import { useDispatch, useSelector } from "react-redux";
import { toggleList, initializeLists } from "../../entities/lists"; // Импорт санки

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
    <Page>
      {currentList === "BlackList" && <List list="BlackList" setList={setCurrentList} />}
      {currentList === "WhiteList" && <List list="WhiteList" setList={setCurrentList} />}
      
      {!currentList && (
        <div className={styles.cont}>
          <div className={styles.h}>Листы</div>
          <div className={styles.btnCont}>
            <div className={styles.btnFlex}>
              <Button 
                className={styles.btnList} 
                size="large" 
                onClick={() => setCurrentList("BlackList")}
              >
                Черный лист
              </Button>
              <div className={styles.switchFlex}>
                <div>Черный лист</div>
                <Switch 
                  checked={isBlacklistEnabled} 
                  onChange={checked => handleToggle("BlackList", checked)} 
                />
              </div>
            </div>
            <div className={styles.btnFlex}>
              <Button 
                className={styles.btnList} 
                size="large" 
                onClick={() => setCurrentList("WhiteList")}
              >
                Белый лист
              </Button>
              <div className={styles.switchFlex}>
                <div>Белый лист</div>
                <Switch 
                  checked={isWhitelistEnabled} 
                  onChange={checked => handleToggle("WhiteList", checked)} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default React.memo(Lists);