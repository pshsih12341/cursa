import Page from "features/Page";
import React, {useState} from "react";
import styles from "./style.module.scss";
import {AutoComplete, Button, DatePicker, Spin} from "antd";
import {blockedUrls} from "shared/consts/urls";

const {RangePicker} = DatePicker;

const Reports: React.FC = () => {
	const [dataPicker, setDataPicker] = useState<any>();
	const [site, setSite] = useState("");
	const [loading, setLoading] = useState(false);

	return (
		<Page>
			{loading && (
				<div className={styles.overlay}>
					<Spin size='large' tip='Отчет создается...' className={styles.spinner} />
				</div>
			)}
			<div className={styles.h}>Отчеты</div>
			<div className={styles.dates}>
				<div>Выберети время отчета</div>
				<RangePicker
					value={dataPicker}
					size='large'
					onChange={e => {
						setDataPicker(e);
					}}
				/>
				<div>Выберите требуемый сайт (необязательно)</div>
				<AutoComplete size='large' value={site} onChange={value => setSite(value)} placeholder='Введите ссылку' options={blockedUrls.map(url => ({value: url}))} filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1} className={styles.input} />
			</div>
			<div className={styles.center}>
				<Button size='large' color='geekblue' className={styles.btn} onClick={() => setLoading(true)}>
					Получить отчет
				</Button>
			</div>
		</Page>
	);
};

export default React.memo(Reports);
