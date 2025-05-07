import React, {useRef} from "react";
import styles from "./style.module.scss";
import CategoryPieChart from "./Piechart";
import StatItem from "../Statistick/StatItem";
import DayItem from "./DayItem";
import {Button} from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Report = ({currentList}) => {
	console.log(currentList);
	const reportRef = useRef();

	const exportToPdf = async () => {
		const input = document.getElementById("pdf-container");

		const canvas = await html2canvas(input, {
			useCORS: true,
			scale: 2, // повышает качество
		});

		const imgData = canvas.toDataURL("image/png");
		const pdf = new jsPDF("p", "mm", "a4");

		const imgProps = pdf.getImageProperties(imgData);
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

		const pageHeight = pdf.internal.pageSize.getHeight();
		let heightLeft = pdfHeight;
		let position = 0;

		pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
		heightLeft -= pageHeight;

		while (heightLeft > 0) {
			position = heightLeft - pdfHeight;
			pdf.addPage();
			pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
			heightLeft -= pageHeight;
		}

		pdf.save("report.pdf");
	};
	return (
		<div className={styles.contentCont} ref={reportRef}>
			<CategoryPieChart categorySummary={currentList.categorySummary} totalTimeSec={currentList.totalTimeSec} />
			<div className={styles.reportBlock}>
				<div className={styles.sublyTitle}>Топ сайтов</div>
				{currentList.topSites?.map((el, index) => (
					<StatItem key={el.domain} stat={el} totalSeconds={currentList.totalTimeSec} number={index + 1} />
				))}
			</div>
			<div className={styles.reportBlock}>
				<div className={styles.sublyTitle}>Самые активные дни</div>
				{currentList.activityByDay?.map((el, index) => (
					<DayItem day={el} number={index + 1} />
				))}
			</div>
			<Button type='primary' className={styles.btnbottom} onClick={exportToPdf}>
				Выгрузить в PDF
			</Button>
		</div>
	);
};

export default Report;
