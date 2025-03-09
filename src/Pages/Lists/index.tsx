import React, {useState} from "react";
import styles from "./styles.module.scss";
import Page from "features/Page";
import {Button, Switch} from "antd";
import List from "./List";

const Lists: React.FC = () => {
	const [list, setList] = useState<"BlackList" | "WhiteList" | null>(null);

	return (
		<Page>
			{list === "BlackList" && <List list={"BlackList"} setList={setList} />}
			{list === "WhiteList" && <List list={"WhiteList"} setList={setList} />}
			{!list && (
				<div className={styles.cont}>
					<div className={styles.h}>Листы</div>
					<div className={styles.btnCont}>
						<div className={styles.btnFlex}>
							<Button className={styles.btnList} size='large' onClick={() => setList("BlackList")}>
								Черный лист
							</Button>
							<div className={styles.switchFlex}>
								<div>Черный лист</div>
								<Switch />
							</div>
						</div>
						<div className={styles.btnFlex}>
							<Button className={styles.btnList} size='large' onClick={() => setList("WhiteList")}>
								Белый лист
							</Button>
							<div className={styles.switchFlex}>
								<div>Белый лист</div>
								<Switch />
							</div>
						</div>
					</div>
				</div>
			)}
		</Page>
	);
};

export default React.memo(Lists);
