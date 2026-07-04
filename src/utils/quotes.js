import { differenceInCalendarDays } from "date-fns";

export const quotes = [
  "Sometimes love is simply remembering someone in the middle of a busy day.",
  "Busy days can still hold soft thoughts.",
  "Love lives in the little things.",
  "Your heart has been quietly remembering.",
  "Some people live softly in our thoughts.",
  "A small thought can still feel like a warm light.",
  "Tender moments count, even when they arrive quietly.",
];

export const getDailyQuote = (date = new Date()) => {
  const index = Math.abs(differenceInCalendarDays(date, new Date(2026, 0, 1))) % quotes.length;
  return quotes[index];
};
