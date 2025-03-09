import React, {useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "shared/hooks/stateHooks";
import styles from "./styles.module.scss";
import {CloseOutlined, LeftCircleOutlined} from "@ant-design/icons";
import {Button, Checkbox, Input, Space} from "antd";
import {addTolist, deleteFromList} from "entities/lists";

const List: React.FC<{list: "BlackList" | "WhiteList"; setList: (list: "BlackList" | "WhiteList" | null) => void}> = ({list, setList}) => {
	const listState = useAppSelector(s => s.listSlyce[list]);
	const [input, setInput] = useState("");
	const dispatch = useAppDispatch();

	const title = {
		BlackList: "Черный лист",
		WhiteList: "Белый лист",
	};

	const getFaviconUrl = (domain: string): string => {
		return `https://${domain}/favicon.ico`;
	};

	return (
		<div className={styles.listPage}>
			<div className={styles.header}>
				<LeftCircleOutlined className={styles.back} onClick={() => setList(null)} />
				<div className={styles.h}>{title[list]}</div>
			</div>
			<div className={styles.listList}>
				{listState.map(el => (
					<div className={styles.item} key={el}>
						<div className={styles.itemFlex}>
							<img src={getFaviconUrl(el)} alt='logo' className={styles.icon} />
							{el}
						</div>
						<CloseOutlined className={styles.close} onClick={() => dispatch(deleteFromList({item: el, list}))} />
					</div>
				))}
			</div>
			<Space.Compact className={styles.input}>
				<Input value={input} onChange={e => setInput(e.target.value)} placeholder='Введите ссылку' />
				<Button
					type='primary'
					onClick={() => {
						if (input) {
							console.log(123);
							dispatch(addTolist({item: input, list}));
						}
					}}>
					Потвердить
				</Button>
			</Space.Compact>
		</div>
	);
};

export default React.memo(List);
