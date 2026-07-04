import { createDemoMoments } from "./demoData";

export const STORAGE_KEY = "little-miss-counter-moments";

const isMoment = (moment) =>
  moment &&
  typeof moment.id === "string" &&
  typeof moment.createdAt === "string" &&
  !Number.isNaN(new Date(moment.createdAt).getTime());

const sortMoments = (moments) =>
  [...moments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const getMoments = () => {
  if (typeof window === "undefined") return [];

  const existing = window.localStorage.getItem(STORAGE_KEY);

  if (existing === null) {
    const demoMoments = createDemoMoments();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoMoments));
    return demoMoments;
  }

  try {
    const parsed = JSON.parse(existing);
    return Array.isArray(parsed) ? sortMoments(parsed.filter(isMoment)) : [];
  } catch {
    return [];
  }
};

export const saveMoment = () => {
  const moment = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
  };

  const nextMoments = sortMoments([moment, ...getMoments()]);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMoments));
  return moment;
};

export const clearMoments = () => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};
