import {Button, TimePicker} from "antd";
import dayjs from "dayjs";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateSchedule} from "../../entities/lists";
import styles from "./styles.module.scss";

const ScheduleSelector = ({listType}) => {
	const dispatch = useDispatch();
	const schedule = useSelector(state => (listType === "BlackList" ? state.listSlyce.BlackListSchedule : state.listSlyce.WhiteListSchedule));

	const [start, setStart] = useState(schedule.startTime ? dayjs(schedule.startTime, "HH:mm") : null);
	const [end, setEnd] = useState(schedule.endTime ? dayjs(schedule.endTime, "HH:mm") : null);
	const [days, setDays] = useState(schedule.days || []);

	const handleSave = selectedDays => {
		if (!start || !end) return;
		dispatch(
			updateSchedule({
				list: listType,
				days: selectedDays,
				startTime: start.format("HH:mm"),
				endTime: end.format("HH:mm"),
			})
		);
	};

	return (
		<div className={styles.cont}>
			<div className={styles.flex}>
				<div className={styles.block}>
					Начало
					<TimePicker format='HH:mm' value={start} onChange={setStart} />
				</div>
				<div className={styles.block}>
					Конец
					<TimePicker format='HH:mm' value={end} onChange={setEnd} />
				</div>
			</div>
			<Button
				className={styles.weekBtn}
				type={days.includes("weekdays") ? "primary" : "default"}
				onClick={() => {
					const newDays = days.includes("weekdays") ? days.filter(d => d !== "weekdays") : [...days, "weekdays"];
					setDays(newDays);
					handleSave(newDays);
				}}>
				Будни
			</Button>
			<Button
				className={styles.weekBtn}
				type={days.includes("weekends") ? "primary" : "default"}
				onClick={() => {
					const newDays = days.includes("weekends") ? days.filter(d => d !== "weekends") : [...days, "weekends"];
					setDays(newDays);
					handleSave(newDays);
				}}>
				Выходные
			</Button>
		</div>
	);
};

export default ScheduleSelector;
