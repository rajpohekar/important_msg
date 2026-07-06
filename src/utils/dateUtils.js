export const APP_TIME_ZONE = import.meta.env.VITE_APP_TIME_ZONE || "Asia/Kolkata";

const datePartsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const exactTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const dateLabelFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TIME_ZONE,
  day: "numeric",
  month: "short",
});

const tooltipDateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const weekdayShortFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIME_ZONE,
  weekday: "short",
});

const weekdayLongFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIME_ZONE,
  weekday: "long",
});

const weekdayIndex = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

const toDate = (dateValue) => new Date(dateValue);

const keyToNoonUtcDate = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
};

const getParts = (dateValue) =>
  datePartsFormatter.formatToParts(toDate(dateValue)).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});

export const getDateKey = (dateValue) => {
  const parts = getParts(dateValue);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

export const getTodayKey = (referenceDate = new Date()) => getDateKey(referenceDate);

export const addDaysToKey = (key, amount) => {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12));
  return getDateKey(date);
};

export const getYesterdayKey = (referenceDate = new Date()) =>
  addDaysToKey(getTodayKey(referenceDate), -1);

export const getCurrentMonthPrefix = (referenceDate = new Date()) =>
  getTodayKey(referenceDate).slice(0, 7);

export const getCurrentWeekKeys = (referenceDate = new Date()) => {
  const todayKey = getTodayKey(referenceDate);
  const todayWeekday = getWeekdayShortLabelFromKey(todayKey);
  const daysSinceMonday = weekdayIndex[todayWeekday] ?? 0;
  const mondayKey = addDaysToKey(todayKey, -daysSinceMonday);

  return Array.from({ length: 7 }, (_, index) => addDaysToKey(mondayKey, index));
};

export const getCurrentMonthKeys = (referenceDate = new Date()) => {
  const todayKey = getTodayKey(referenceDate);
  const [year, month] = todayKey.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${year}-${String(month).padStart(2, "0")}-${day}`;
  });
};

export const getWeekdayShortLabelFromKey = (key) =>
  weekdayShortFormatter.format(keyToNoonUtcDate(key));

export const getWeekdayLongLabelFromKey = (key) =>
  weekdayLongFormatter.format(keyToNoonUtcDate(key));

export const getDateLabelFromKey = (key) => dateLabelFormatter.format(keyToNoonUtcDate(key));

export const getTodayDateLabel = () => getDateLabelFromKey(getTodayKey());

export const formatExactMoment = (dateValue) => {
  const date = toDate(dateValue);
  const key = getDateKey(date);
  const time = exactTimeFormatter.format(date);
  const dateLabel = tooltipDateFormatter.format(keyToNoonUtcDate(key));

  return `${dateLabel}, ${time}`;
};

export const formatTooltipDate = (dateValue) => {
  if (typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return tooltipDateFormatter.format(keyToNoonUtcDate(dateValue));
  }

  return tooltipDateFormatter.format(toDate(dateValue));
};
