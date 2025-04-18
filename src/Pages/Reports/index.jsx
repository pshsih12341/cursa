import React, {useState} from "react";
import styles from "./style.module.scss";
import {Button, DatePicker, Select, Spin} from "antd";
import {blockedOptions} from "shared/consts/urls";
import classNames from "classnames";
import sharedStyles from "../../shared/styles/sharedStyles.module.scss";

const {RangePicker} = DatePicker;

const Reports = () => {
	const [dataPicker, setDataPicker] = useState();
	const [site, setSite] = useState([]);
	const [loading, setLoading] = useState(false);

	const onButtonClick = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};

	return (
		<div className={sharedStyles.mainCont}>
			{loading && (
				<div className={styles.overlay}>
					<Spin size='large' tip='Отчет создается...' className={styles.spinner} />
				</div>
			)}
			<div className={sharedStyles.header}>Отчеты</div>
			<div className={sharedStyles.contentCont}>
				<div className={styles.flex}>
					<div className={styles.text}>Выберети время отчета</div>
					<RangePicker value={dataPicker} onChange={setDataPicker} className={styles.full} dropdownClassName={styles.datePickerCompact} placeholder={["Начальная дата", "Конечная дата"]} />
				</div>
				<div className={styles.flex}>
					<div className={styles.text}>
						Выберите требуемые сайты
						<div>(необязательно)</div>
					</div>
					<Select value={site} onChange={setSite} options={blockedOptions} mode='multiple' className={classNames(styles.full, styles.selector)} />
				</div>
				<Button disabled={!dataPicker} onClick={onButtonClick} type='primary' className={styles.bottomBtn}>
					Сформировать отчет
				</Button>
			</div>
		</div>
	);
};

export default React.memo(Reports);
