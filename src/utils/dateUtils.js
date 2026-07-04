import { format, isToday, isYesterday } from "date-fns";

export const formatTimelineMoment = (dateValue) => {
  const date = new Date(dateValue);
  const time = format(date, "h:mm a");

  if (isToday(date)) return `Today, ${time}`;
  if (isYesterday(date)) return `Yesterday, ${time}`;

  return `${format(date, "d MMM")}, ${time}`;
};

export const formatTooltipDate = (dateValue) => format(new Date(dateValue), "d MMM yyyy");
