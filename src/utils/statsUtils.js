import {
  getCurrentMonthKeys,
  getCurrentMonthPrefix,
  getCurrentWeekKeys,
  getDateKey,
  getDateLabelFromKey,
  getTodayKey,
  getWeekdayLongLabelFromKey,
  getWeekdayShortLabelFromKey,
} from "./dateUtils";

const parse = (moment) => new Date(moment.createdAt);

const countByDateKey = (moments) =>
  moments.reduce((acc, moment) => {
    const key = getDateKey(moment.createdAt);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

export const getTodayCount = (moments) => {
  const todayKey = getTodayKey();
  return moments.filter((moment) => getDateKey(moment.createdAt) === todayKey).length;
};

export const getMonthlyCount = (moments) => {
  const currentMonth = getCurrentMonthPrefix();
  return moments.filter((moment) => getDateKey(moment.createdAt).startsWith(currentMonth)).length;
};

export const getWeeklyData = (moments) => {
  const counts = countByDateKey(moments);

  return getCurrentWeekKeys().map((key) => ({
    day: getWeekdayShortLabelFromKey(key),
    date: key,
    count: counts[key] || 0,
  }));
};

export const getMonthlyData = (moments) => {
  const counts = countByDateKey(moments);

  return getCurrentMonthKeys().map((key) => ({
    day: String(Number(key.slice(8))),
    label: getDateLabelFromKey(key),
    date: key,
    count: counts[key] || 0,
  }));
};

export const getMostThoughtfulDay = (moments) => {
  if (!moments.length) return null;

  const grouped = moments.reduce((acc, moment) => {
    const key = getDateKey(moment.createdAt);
    const date = parse(moment);

    acc[key] = {
      count: (acc[key]?.count ?? 0) + 1,
      latestDate: acc[key]?.latestDate > date ? acc[key].latestDate : date,
    };

    return acc;
  }, {});

  const [key, value] = Object.entries(grouped).sort((a, b) => {
    if (b[1].count !== a[1].count) return b[1].count - a[1].count;
    return b[1].latestDate - a[1].latestDate;
  })[0];

  return {
    key,
    count: value.count,
    dayName: getWeekdayLongLabelFromKey(key),
    dateLabel: getDateLabelFromKey(key),
  };
};

export const getRecentMoments = (moments, limit = 10) =>
  [...moments]
    .sort((a, b) => parse(b) - parse(a))
    .slice(0, limit);
