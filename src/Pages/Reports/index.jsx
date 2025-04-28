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
	const [options, setOptions] = useState(blockedOptions);

	const generateReportId = () => `report_${Date.now()}`;

	const onButtonClick = async () => {
		setLoading(true);
		const reportData = {
			id: generateReportId(),
			dates: dataPicker.map(d => d.format("YYYY-MM-DD")),
			sites: site,
			status: "pending",
			createdAt: new Date().toISOString(),
		};
		// eslint-disable-next-line no-undef
		const {reports: existingReports = []} = await chrome.storage.local.get("reports");
		// eslint-disable-next-line no-undef
		await chrome.storage.local.set({
			reports: [...existingReports, reportData],
		});

		// Устанавливаем алерт
		// eslint-disable-next-line no-undef
		chrome.alarms.create(reportData.id, {delayInMinutes: 30 / 60});
		setTimeout(() => {
			setLoading(false);
		}, 2000);
		setDataPicker();
		setSite();
	};

	const extractDomain = url => {
		try {
			const cleanedUrl = url.startsWith("http") ? url : `http://${url}`;
			const hostname = new URL(cleanedUrl).hostname;
			return hostname.replace(/^www\./, "");
		} catch {
			return url;
		}
	};

	const handleSiteChange = value => {
		const updatedSites = [];
		const updatedOptions = [...options];

		value.forEach(item => {
			const domain = extractDomain(item);
			if (!options.find(opt => opt.value === domain)) {
				updatedOptions.push({label: domain, value: domain});
			}
			updatedSites.push(domain);
		});

		setOptions(updatedOptions);
		setSite(updatedSites);
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
					<Select value={site} onChange={handleSiteChange} options={options} mode='tags' className={classNames(styles.full, styles.selector)} />
				</div>
				<Button disabled={!dataPicker} onClick={onButtonClick} type='primary' className={styles.bottomBtn}>
					Сформировать отчет
				</Button>
			</div>
		</div>
	);
};

export default React.memo(Reports);
