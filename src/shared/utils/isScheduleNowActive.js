import dayjs from "dayjs";

export const isScheduleNowActive = (schedule) => {
  if (!schedule || !schedule.days || !schedule.startTime || !schedule.endTime) return false;

  const now = dayjs();
  const currentDay = now.day(); // 0 - Sunday, 1 - Monday, ..., 6 - Saturday
  const isWeekday = currentDay >= 1 && currentDay <= 5;
  const isWeekend = currentDay === 0 || currentDay === 6;

  const withinTime = () => {
    const start = dayjs(schedule.startTime, "HH:mm");
    const end = dayjs(schedule.endTime, "HH:mm");
    return now.isAfter(start) && now.isBefore(end);
  };

  if (schedule.days.includes("weekdays") && isWeekday && withinTime()) return true;
  if (schedule.days.includes("weekends") && isWeekend && withinTime()) return true;

  return false;
};
