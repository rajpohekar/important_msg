import { createDemoMoments } from "./demoData";

export const STORAGE_KEY = "little-miss-counter-moments";
export const PHOTO_STORAGE_KEY = "little-miss-counter-us-photo";

const isMoment = (moment) =>
  moment &&
  typeof moment.id === "string" &&
  typeof moment.createdAt === "string" &&
  !Number.isNaN(new Date(moment.createdAt).getTime());

const sortMoments = (moments) =>
  [...moments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const normalizeMoments = (moments) =>
  Array.isArray(moments) ? sortMoments(moments.filter(isMoment)) : [];

export const createMoment = () => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  createdAt: new Date().toISOString(),
});

export const storeMoments = (moments) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeMoments(moments)));
};

export const getStoredMoments = () => {
  if (typeof window === "undefined") return [];

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing === null) return [];

  try {
    return normalizeMoments(JSON.parse(existing));
  } catch {
    return [];
  }
};

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
    return normalizeMoments(parsed);
  } catch {
    return [];
  }
};

export const saveMoment = () => {
  const moment = createMoment();

  storeMoments([moment, ...getMoments()]);
  return moment;
};

export const clearMoments = () => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};

export const getPhoto = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(PHOTO_STORAGE_KEY) || "";
};

export const savePhoto = (photo) => {
  if (typeof window === "undefined") return;
  if (photo) {
    window.localStorage.setItem(PHOTO_STORAGE_KEY, photo);
  } else {
    window.localStorage.removeItem(PHOTO_STORAGE_KEY);
  }
};
