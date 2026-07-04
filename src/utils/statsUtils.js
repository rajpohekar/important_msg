import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isThisMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const parse = (moment) => new Date(moment.createdAt);

export const getTodayCount = (moments) => moments.filter((moment) => isToday(parse(moment))).length;

export const getMonthlyCount = (moments) =>
  moments.filter((moment) => isThisMonth(parse(moment))).length;

export const getWeeklyData = (moments) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return Array.from({ length: 7 }, (_, index) => {
    const day = addDays(weekStart, index);

    return {
      day: format(day, "EEE"),
      date: day.toISOString(),
      count: moments.filter((moment) => isSameDay(parse(moment), day)).length,
    };
  });
};

export const getMonthlyData = (moments) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  return eachDayOfInterval({ start: monthStart, end: monthEnd }).map((day) => ({
    day: format(day, "d"),
    label: format(day, "MMM d"),
    date: day.toISOString(),
    count: moments.filter(
      (moment) => isSameMonth(parse(moment), today) && isSameDay(parse(moment), day),
    ).length,
  }));
};

export const getMostThoughtfulDay = (moments) => {
  if (!moments.length) return null;

  const grouped = moments.reduce((acc, moment) => {
    const date = parse(moment);
    const key = format(date, "yyyy-MM-dd");
    acc[key] = {
      count: (acc[key]?.count ?? 0) + 1,
      date,
    };
    return acc;
  }, {});

  const [key, value] = Object.entries(grouped).sort((a, b) => {
    if (b[1].count !== a[1].count) return b[1].count - a[1].count;
    return b[1].date - a[1].date;
  })[0];

  return {
    key,
    count: value.count,
    dayName: format(value.date, "EEEE"),
    dateLabel: format(value.date, "d MMM"),
  };
};

export const getRecentMoments = (moments, limit = 10) =>
  [...moments]
    .sort((a, b) => parse(b) - parse(a))
    .slice(0, limit);
