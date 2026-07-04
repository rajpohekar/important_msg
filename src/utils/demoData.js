import { addHours, setHours, setMinutes, subDays } from "date-fns";

const momentsForDay = (date, hours) =>
  hours.map((hour, index) => ({
    id: `demo-${date.toISOString().slice(0, 10)}-${index}-${hour}`,
    createdAt: setMinutes(setHours(date, hour), (index * 17 + 8) % 60).toISOString(),
  }));

export const createDemoMoments = () => {
  const now = new Date();
  const today = momentsForDay(now, [9, 14, 20]);
  const yesterday = momentsForDay(subDays(now, 1), [8, 16]);
  const twoDaysAgo = momentsForDay(subDays(now, 2), [11, 21, 22]);
  const fourDaysAgo = momentsForDay(subDays(now, 4), [10, 13, 18, 23]);
  const sixDaysAgo = momentsForDay(subDays(now, 6), [19]);
  const nineDaysAgo = momentsForDay(subDays(now, 9), [12, 20]);
  const thirteenDaysAgo = momentsForDay(subDays(now, 13), [7, 15, 22]);
  const eighteenDaysAgo = momentsForDay(subDays(now, 18), [18]);
  const twentyTwoDaysAgo = momentsForDay(subDays(now, 22), [9, 21]);

  return [
    ...today,
    ...yesterday,
    ...twoDaysAgo,
    ...fourDaysAgo,
    ...sixDaysAgo,
    ...nineDaysAgo,
    ...thirteenDaysAgo,
    ...eighteenDaysAgo,
    ...twentyTwoDaysAgo,
    {
      id: "demo-soft-evening-extra",
      createdAt: addHours(subDays(now, 4), 1).toISOString(),
    },
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
