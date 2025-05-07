import React, {useState, useEffect} from "react";
import styles from "./style.module.scss";
import {Button, DatePicker, Select, Spin, message, Modal, Input} from "antd";
import {blockedOptions} from "shared/consts/urls";
import classNames from "classnames";
import sharedStyles from "../../shared/styles/sharedStyles.module.scss";
import {CalendarFilled, CloseOutlined, EditFilled, LeftCircleOutlined} from "@ant-design/icons";
import {useSelector, useDispatch} from "react-redux";
import Report from "./Report";
import {createReport, initializeReports, updateReport, deleteReport} from "../../entities/reporst";

const {RangePicker} = DatePicker;
const {confirm} = Modal;

const reports = [
	{
		"reportId": "1",
		"dateFrom": "2025-03-31",
		"dateTo": "2025-04-06",
		"siteFilter": [],
		"generatedAt": "2025-04-08T10:12:00Z",
		"totalTimeSec": 133920,
		"avgTimePerDaySec": 19131,
		"topSites": [
			{"domain": "youtube.com", "seconds": 25432, "category": "entertainment"},
			{"domain": "vk.com", "seconds": 16511, "category": "entertainment"},
			{"domain": "deepseek.com", "seconds": 10721, "category": "productive"},
			{"domain": "docs.google.com", "seconds": 9201, "category": "productive"},
			{"domain": "dzen.ru", "seconds": 7312, "category": "unknown"},
		],
		"activityByDay": [
			{
				"date": "2025-04-02",
				"topSite": "youtube.com",
				"topSiteTimeSec": 10442,
				"totalTimeSec": 29273,
				"entertainmentSec": 16720,
				"productiveSec": 6331,
				"unknownSec": 6222,
				"topSiteCategory": "entertainment",
			},
			{
				"date": "2025-04-04",
				"topSite": "rutube.ru",
				"topSiteTimeSec": 7181,
				"totalTimeSec": 27911,
				"entertainmentSec": 14190,
				"productiveSec": 9032,
				"unknownSec": 4689,
				"topSiteCategory": "entertainment",
			},
			{
				"date": "2025-03-31",
				"topSite": "deepseek.com",
				"topSiteTimeSec": 5333,
				"totalTimeSec": 26668,
				"entertainmentSec": 8412,
				"productiveSec": 13964,
				"unknownSec": 4292,
				"topSiteCategory": "productive",
			},
		],
		"categorySummary": {
			"entertainment": 55800,
			"productive": 36000,
			"unknown": 42120,
		},
	},
	{
		"reportId": "2",
		"dateFrom": "2025-04-07",
		"dateTo": "2025-04-13",
		"siteFilter": [],
		"generatedAt": "2025-04-15T09:43:00Z",
		"totalTimeSec": 126360,
		"avgTimePerDaySec": 18051,
		"topSites": [
			{"domain": "deepseek.com", "seconds": 19912, "category": "productive"},
			{"domain": "docs.google.com", "seconds": 15291, "category": "productive"},
			{"domain": "youtube.com", "seconds": 14331, "category": "entertainment"},
			{"domain": "newlms.misis.ru", "seconds": 7381, "category": "productive"},
			{"domain": "dzen.ru", "seconds": 5295, "category": "unknown"},
		],
		"activityByDay": [
			{
				"date": "2025-04-07",
				"topSite": "deepseek.com",
				"topSiteTimeSec": 7312,
				"totalTimeSec": 26911,
				"entertainmentSec": 4558,
				"productiveSec": 14739,
				"unknownSec": 7614,
				"topSiteCategory": "productive",
			},
			{
				"date": "2025-04-10",
				"topSite": "docs.google.com",
				"topSiteTimeSec": 6398,
				"totalTimeSec": 25360,
				"entertainmentSec": 5880,
				"productiveSec": 14880,
				"unknownSec": 4600,
				"topSiteCategory": "productive",
			},
			{
				"date": "2025-04-11",
				"topSite": "youtube.com",
				"topSiteTimeSec": 5312,
				"totalTimeSec": 24860,
				"entertainmentSec": 10480,
				"productiveSec": 10640,
				"unknownSec": 3740,
				"topSiteCategory": "entertainment",
			},
		],
		"categorySummary": {
			"entertainment": 33600,
			"productive": 59400,
			"unknown": 33360,
		},
	},
	{
		"reportId": "3",
		"dateFrom": "2025-03-31",
		"dateTo": "2025-04-06",
		"siteFilter": [],
		"generatedAt": "2025-04-08T10:12:00Z",
		"totalTimeSec": 153920,
		"avgTimePerDaySec": 19131,
		"topSites": [
			{"domain": "rutube.ru", "seconds": 45432, "category": "entertainment"},
			{"domain": "figma.com", "seconds": 27321, "category": "productive"},
			{"domain": "twitch.tv", "seconds": 11511, "category": "entertainment"},
			{"domain": "dotabuff.com", "seconds": 9021, "category": "entertainment"},
			{"domain": "localhost:5173", "seconds": 7112, "category": "unknown"},
		],
		"activityByDay": [
			{
				"date": "2025-04-02",
				"topSite": "rutube.ru",
				"topSiteTimeSec": 19442,
				"totalTimeSec": 40273,
				"entertainmentSec": 26720,
				"productiveSec": 6631,
				"unknownSec": 6922,
				"topSiteCategory": "entertainment",
			},
			{
				"date": "2025-04-03",
				"topSite": "rutube.ru",
				"topSiteTimeSec": 10781,
				"totalTimeSec": 34911,
				"entertainmentSec": 22090,
				"productiveSec": 12719,
				"unknownSec": 102,
				"topSiteCategory": "entertainment",
			},
			{
				"date": "2025-04-04",
				"topSite": "figma.com",
				"topSiteTimeSec": 9333,
				"totalTimeSec": 30668,
				"entertainmentSec": 10503,
				"productiveSec": 16964,
				"unknownSec": 3201,
				"topSiteCategory": "productive",
			},
		],
		"categorySummary": {
			"entertainment": 88193,
			"productive": 43433,
			"unknown": 22294,
		},
	},
	{
		"reportId": "4",
		"dateFrom": "2025-04-07",
		"dateTo": "2025-04-13",
		"siteFilter": [],
		"generatedAt": "2025-04-08T10:12:00Z",
		"totalTimeSec": 133920,
		"avgTimePerDaySec": 19131,
		"topSites": [
			{"domain": "bigbangtheory.fans", "seconds": 47432, "category": "entertainment"},
			{"domain": "figma.com", "seconds": 28321, "category": "productive"},
			{"domain": "localhost:5173", "seconds": 17112, "category": "unknown"},
			{"domain": "twitch.tv", "seconds": 10511, "category": "entertainment"},
			{"domain": "mobalytics.gg", "seconds": 5821, "category": "entertainment"},
		],
		"activityByDay": [
			{
				"date": "2025-04-11",
				"topSite": "bigbangtheory.fans",
				"topSiteTimeSec": 19442,
				"totalTimeSec": 34123,
				"entertainmentSec": 25172,
				"productiveSec": 6412,
				"unknownSec": 2539,
				"topSiteCategory": "entertainment",
			},
			{
				"date": "2025-04-09",
				"topSite": "localhost:5173",
				"topSiteTimeSec": 7781,
				"totalTimeSec": 31911,
				"entertainmentSec": 17162,
				"productiveSec": 4119,
				"unknownSec": 10630,
				"topSiteCategory": "unknown",
			},
			{
				"date": "2025-04-08",
				"topSite": "figma.com",
				"topSiteTimeSec": 9721,
				"totalTimeSec": 27668,
				"entertainmentSec": 9891,
				"productiveSec": 16721,
				"unknownSec": 1056,
				"topSiteCategory": "productive",
			},
		],
		"categorySummary": {
			"entertainment": 68193,
			"productive": 41433,
			"unknown": 24294,
		},
	},
	{
		"reportId": "5",
		"dateFrom": "2025-03-31",
		"dateTo": "2025-04-06",
		"siteFilter": [],
		"generatedAt": "2025-04-08T10:12:00Z",
		"totalTimeSec": 108920,
		"avgTimePerDaySec": 19131,
		"topSites": [
			{"domain": "confluence.inno.tech", "seconds": 29321, "category": "productive"},
			{"domain": "jira.inno.tech", "seconds": 17432, "category": "productive"},
			{"domain": "slack.inno.tech", "seconds": 13511, "category": "productive"},
			{"domain": "youtube.com", "seconds": 12021, "category": "entertainment"},
			{"domain": "lichess.org", "seconds": 10112, "category": "entertainment"},
		],
		"activityByDay": [
			{
				"date": "2025-03-31",
				"topSite": "jira.inno.tech",
				"topSiteTimeSec": 9512,
				"totalTimeSec": 24973,
				"entertainmentSec": 9813,
				"productiveSec": 13913,
				"unknownSec": 1547,
				"topSiteCategory": "productive",
			},
			{
				"date": "2025-04-04",
				"topSite": "lichess.org",
				"topSiteTimeSec": 10112,
				"totalTimeSec": 20911,
				"entertainmentSec": 10212,
				"productiveSec": 8291,
				"unknownSec": 2408,
				"topSiteCategory": "entertainment",
			},
			{
				"date": "2025-04-02",
				"topSite": "unknown",
				"topSiteTimeSec": 4614,
				"totalTimeSec": 18668,
				"entertainmentSec": 1456,
				"productiveSec": 8261,
				"unknownSec": 8951,
				"topSiteCategory": "unknown",
			},
		],
		"categorySummary": {
			"entertainment": 22183,
			"productive": 73433,
			"unknown": 13304,
		},
	},
	{
		"reportId": "6",
		"dateFrom": "2025-04-07",
		"dateTo": "2025-04-13",
		"siteFilter": [],
		"generatedAt": "2025-04-08T10:12:00Z",
		"totalTimeSec": 118920,
		"avgTimePerDaySec": 19131,
		"topSites": [
			{"domain": "confluence.inno.tech", "seconds": 30821, "category": "productive"},
			{"domain": "slack.inno.tech", "seconds": 18511, "category": "productive"},
			{"domain": "jira.inno.tech", "seconds": 14432, "category": "productive"},
			{"domain": "lichess.org", "seconds": 13112, "category": "entertainment"},
			{"domain": "kinopoisk.ru", "seconds": 12021, "category": "entertainment"},
		],
		"activityByDay": [
			{
				"date": "2025-04-07",
				"topSite": "confluence.inno.tech",
				"topSiteTimeSec": 9512,
				"totalTimeSec": 23973,
				"entertainmentSec": 3813,
				"productiveSec": 18913,
				"unknownSec": 1247,
				"topSiteCategory": "productive",
			},
			{
				"date": "2025-04-09",
				"topSite": "slack.inno.tech",
				"topSiteTimeSec": 9112,
				"totalTimeSec": 21911,
				"entertainmentSec": 4212,
				"productiveSec": 13291,
				"unknownSec": 4408,
				"topSiteCategory": "productive",
			},
			{
				"date": "2025-04-11",
				"topSite": "lichess.org",
				"topSiteTimeSec": 13112,
				"totalTimeSec": 19668,
				"entertainmentSec": 14112,
				"productiveSec": 5556,
				"unknownSec": 0,
				"topSiteCategory": "entertainment",
			},
		],
		"categorySummary": {
			"entertainment": 15183,
			"productive": 87433,
			"unknown": 16304,
		},
	},
	{
		"reportId": "7",
		"dateFrom": "2025-03-31",
		"dateTo": "2025-04-06",
		"siteFilter": [],
		"generatedAt": "2025-04-08T10:12:00Z",
		"totalTimeSec": 99220,
		"avgTimePerDaySec": 19131,
		"topSites": [
			{"domain": "instagram.com", "seconds": 20321, "category": "entertainment"},
			{"domain": "chatgpt.com", "seconds": 19332, "category": "productive"},
			{"domain": "platform.kata.academy", "seconds": 15511, "category": "productive"},
			{"domain": "youtube.com", "seconds": 11721, "category": "entertainment"},
			{"domain": "web.telegram.org", "seconds": 9012, "category": "entertainment"},
		],
		"activityByDay": [
			{
				"date": "2025-04-03",
				"topSite": "instagram.com",
				"topSiteTimeSec": 8512,
				"totalTimeSec": 19673,
				"entertainmentSec": 12813,
				"productiveSec": 6359,
				"unknownSec": 501,
				"topSiteCategory": "entertainment",
			},
			{
				"date": "2025-04-01",
				"topSite": "platform.kata.academy",
				"topSiteTimeSec": 9112,
				"totalTimeSec": 17911,
				"entertainmentSec": 4780,
				"productiveSec": 13121,
				"unknownSec": 90,
				"topSiteCategory": "productive",
			},
			{
				"date": "2025-04-04",
				"topSite": "instagram.com",
				"topSiteTimeSec": 5614,
				"totalTimeSec": 15668,
				"entertainmentSec": 11952,
				"productiveSec": 2891,
				"unknownSec": 825,
				"topSiteCategory": "entertainment",
			},
		],
		"categorySummary": {
			"entertainment": 52912,
			"productive": 42308,
			"unknown": 4000,
		},
	},
	{
		"reportId": "8",
		"dateFrom": "2025-04-07",
		"dateTo": "2025-04-13",
		"siteFilter": [],
		"generatedAt": "2025-04-08T10:12:00Z",
		"totalTimeSec": 106220,
		"avgTimePerDaySec": 19131,
		"topSites": [
			{"domain": "chatgpt.com", "seconds": 21532, "category": "productive"},
			{"domain": "platform.kata.academy", "seconds": 19511, "category": "productive"},
			{"domain": "instagram.com", "seconds": 19321, "category": "entertainment"},
			{"domain": "web.telegram.org", "seconds": 12012, "category": "entertainment"},
			{"domain": "vk.com", "seconds": 9721, "category": "entertainment"},
		],
		"activityByDay": [
			{
				"date": "2025-04-08",
				"topSite": "chatgpt.com",
				"topSiteTimeSec": 10612,
				"totalTimeSec": 24973,
				"entertainmentSec": 7912,
				"productiveSec": 16123,
				"unknownSec": 938,
				"topSiteCategory": "productive",
			},
			{
				"date": "2025-04-11",
				"topSite": "platform.kata.academy",
				"topSiteTimeSec": 11513,
				"totalTimeSec": 22611,
				"entertainmentSec": 7512,
				"productiveSec": 14311,
				"unknownSec": 788,
				"topSiteCategory": "productive",
			},
			{
				"date": "2025-04-09",
				"topSite": "vk.com",
				"topSiteTimeSec": 8721,
				"totalTimeSec": 21511,
				"entertainmentSec": 17412,
				"productiveSec": 4891,
				"unknownSec": 308,
				"topSiteCategory": "entertainment",
			},
		],
		"categorySummary": {
			"entertainment": 54193,
			"productive": 48153,
			"unknown": 3874,
		},
	},
];

const Reports = () => {
	const [dataPicker, setDataPicker] = useState();
	const [site, setSite] = useState([]);
	const [showList, setShowList] = useState(false);
	const [currentList, setCurrentList] = useState(null);
	const [editingReport, setEditingReport] = useState(null);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [newReportName, setNewReportName] = useState("");
	const dispatch = useDispatch();
	const {reports, loading} = useSelector(state => state.reportSlice);
	const [options, setOptions] = useState(blockedOptions);

	useEffect(() => {
		dispatch(initializeReports());
	}, [dispatch]);

	const onReportClick = id => {
		setCurrentList(reports.find(el => el.reportId === id));
	};

	const handleEditClick = (e, reportId) => {
		e.stopPropagation();
		const report = reports.find(r => r.reportId === reportId);
		setEditingReport(report);
		setNewReportName(report.reportId);
		setEditModalVisible(true);
	};

	const handleDeleteClick = (e, reportId) => {
		e.stopPropagation();
		Modal.confirm({
			title: "Удалить отчет?",
			content: "Это действие нельзя будет отменить.",
			okText: "Удалить",
			okType: "danger",
			cancelText: "Отмена",
			onOk: async () => {
				try {
					await dispatch(deleteReport(reportId)).unwrap();
					message.success("Отчет успешно удален");
					if (currentList?.reportId === reportId) {
						setCurrentList(null);
					}
				} catch (error) {
					message.error("Ошибка при удалении отчета");
				}
			},
		});
	};

	const handleEditSubmit = async () => {
		if (!newReportName.trim()) {
			message.error("Название отчета не может быть пустым");
			return;
		}

		try {
			await dispatch(
				updateReport({
					reportId: editingReport.reportId,
					newName: newReportName.trim(),
				})
			).unwrap();
			message.success("Отчет успешно обновлен");
			setEditModalVisible(false);
			setEditingReport(null);
			setNewReportName("");
		} catch (error) {
			message.error("Ошибка при обновлении отчета");
		}
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

	const handleGenerateReport = async () => {
		if (!dataPicker) return;

		try {
			const [startDate, endDate] = dataPicker;
			const result = await dispatch(
				createReport({
					dateFrom: startDate.format("YYYY-MM-DD"),
					dateTo: endDate.format("YYYY-MM-DD"),
					siteFilter: site,
				})
			).unwrap();

			if (result) {
				setCurrentList(result);
				message.success("Отчет успешно создан");
			}
		} catch (error) {
			console.error("Error creating report:", error);
			message.error("Ошибка при создании отчета");
		}
	};

	return (
		<div className={sharedStyles.mainCont}>
			{loading && (
				<div className={styles.overlay}>
					<Spin size='large' tip='Отчет создается...' className={styles.spinner} />
				</div>
			)}
			<div className={classNames(sharedStyles.header, currentList && styles.column)}>
				{showList && <LeftCircleOutlined onClick={() => setShowList(false)} className={styles.arrow} />}
				{currentList && <LeftCircleOutlined onClick={() => setCurrentList(null)} className={styles.arrow} />}
				{currentList ? "Отчет за" : "Отчеты"}
				{currentList && (
					<div className={styles.subTitile}>
						{currentList.dateFrom} — {currentList.dateTo}
					</div>
				)}
			</div>
			{currentList ?
				<Report currentList={currentList} />
			: showList ?
				<div className={sharedStyles.contentCont}>
					<div className={styles.listList}>
						{reports.map(el => (
							<div className={styles.item} key={el.reportId} onClick={() => onReportClick(el.reportId)}>
								<div className={styles.itemFlex}>
									<CalendarFilled />
									{el.reportId}
								</div>
								<div className={styles.reportItemDiv}>
									<EditFilled onClick={e => handleEditClick(e, el.reportId)} />
									<CloseOutlined className={styles.close} onClick={e => handleDeleteClick(e, el.reportId)} />
								</div>
							</div>
						))}
					</div>
				</div>
			:	<div className={classNames(sharedStyles.contentCont, styles.flexflex)}>
					<div className={styles.topflex}>
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
					</div>
					<div className={styles.bottomFix}>
						<Button type='primary' className={styles.btnbottom} onClick={handleGenerateReport} disabled={!dataPicker}>
							Сформировать отчет
						</Button>
						<Button className={styles.btnbottom} onClick={() => setShowList(true)}>
							Список отчетов
						</Button>
					</div>
				</div>
			}

			<Modal
				title='Редактировать название отчета'
				open={editModalVisible}
				onOk={handleEditSubmit}
				onCancel={() => {
					setEditModalVisible(false);
					setEditingReport(null);
					setNewReportName("");
				}}
				okText='Сохранить'
				cancelText='Отмена'>
				<Input value={newReportName} onChange={e => setNewReportName(e.target.value)} placeholder='Введите новое название отчета' />
			</Modal>
		</div>
	);
};

export default React.memo(Reports);
