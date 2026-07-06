import { createDemoMoments } from "./demoData";

export const STORAGE_KEY = "little-miss-counter-moments";
export const PHOTO_STORAGE_KEY = "little-miss-counter-us-photo";
export const NOTE_STORAGE_KEY = "little-miss-counter-private-note";
export const REPLY_STORAGE_KEY = "little-miss-counter-her-reply";
export const COUNTDOWN_STORAGE_KEY = "little-miss-counter-countdown";
export const GALLERY_STORAGE_KEY = "little-miss-counter-gallery-photos";

const MAX_NOTE_LENGTH = 700;
const MAX_REPLY_LENGTH = 80;
const MAX_COUNTDOWN_TITLE_LENGTH = 42;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const MAX_GALLERY_PHOTOS = 8;

const isMoment = (moment) =>
  moment &&
  typeof moment.id === "string" &&
  typeof moment.createdAt === "string" &&
  !Number.isNaN(new Date(moment.createdAt).getTime());

const sortMoments = (moments) =>
  [...moments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const sortGalleryPhotos = (photos) =>
  [...photos].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

const isGalleryPhoto = (photo) =>
  photo &&
  typeof photo.id === "string" &&
  typeof photo.src === "string" &&
  photo.src.startsWith("data:image/") &&
  typeof photo.createdAt === "string" &&
  !Number.isNaN(new Date(photo.createdAt).getTime());

export const normalizeMoments = (moments) =>
  Array.isArray(moments) ? sortMoments(moments.filter(isMoment)) : [];

export const normalizeGalleryPhotos = (photos) =>
  Array.isArray(photos) ? sortGalleryPhotos(photos.filter(isGalleryPhoto)).slice(0, MAX_GALLERY_PHOTOS) : [];

export const normalizeNote = (note) =>
  typeof note === "string" ? note.slice(0, MAX_NOTE_LENGTH) : "";

export const normalizeReply = (reply) => {
  if (!reply || typeof reply !== "object") return null;

  const message = typeof reply.message === "string" ? reply.message.trim().slice(0, MAX_REPLY_LENGTH) : "";
  const createdAt =
    typeof reply.createdAt === "string" && !Number.isNaN(new Date(reply.createdAt).getTime())
      ? reply.createdAt
      : new Date().toISOString();

  return message ? { message, createdAt } : null;
};

export const normalizeCountdown = (countdown) => {
  if (!countdown || typeof countdown !== "object") return { title: "", date: "" };

  const title =
    typeof countdown.title === "string"
      ? countdown.title.trim().slice(0, MAX_COUNTDOWN_TITLE_LENGTH)
      : "";
  const date = typeof countdown.date === "string" && DATE_PATTERN.test(countdown.date) ? countdown.date : "";

  return {
    title: date ? title || "Our special day" : "",
    date,
  };
};

export const normalizeSharedState = (sharedState = {}) => ({
  photo: typeof sharedState.photo === "string" ? sharedState.photo : "",
  note: normalizeNote(sharedState.note),
  reply: normalizeReply(sharedState.reply),
  countdown: normalizeCountdown(sharedState.countdown),
  galleryPhotos: normalizeGalleryPhotos(sharedState.galleryPhotos),
});

export const createMoment = () => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  createdAt: new Date().toISOString(),
});

export const createGalleryPhoto = (src) => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  src,
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

export const getNote = () => {
  if (typeof window === "undefined") return "";
  return normalizeNote(window.localStorage.getItem(NOTE_STORAGE_KEY) || "");
};

export const saveNote = (note) => {
  if (typeof window === "undefined") return;
  const normalizedNote = normalizeNote(note);

  if (normalizedNote) {
    window.localStorage.setItem(NOTE_STORAGE_KEY, normalizedNote);
  } else {
    window.localStorage.removeItem(NOTE_STORAGE_KEY);
  }
};

export const getReply = () => {
  if (typeof window === "undefined") return null;

  try {
    return normalizeReply(JSON.parse(window.localStorage.getItem(REPLY_STORAGE_KEY) || "null"));
  } catch {
    return null;
  }
};

export const saveReply = (reply) => {
  if (typeof window === "undefined") return;
  const normalizedReply = normalizeReply(reply);

  if (normalizedReply) {
    window.localStorage.setItem(REPLY_STORAGE_KEY, JSON.stringify(normalizedReply));
  } else {
    window.localStorage.removeItem(REPLY_STORAGE_KEY);
  }
};

export const getCountdown = () => {
  if (typeof window === "undefined") return { title: "", date: "" };

  try {
    return normalizeCountdown(JSON.parse(window.localStorage.getItem(COUNTDOWN_STORAGE_KEY) || "null"));
  } catch {
    return { title: "", date: "" };
  }
};

export const saveCountdown = (countdown) => {
  if (typeof window === "undefined") return;
  const normalizedCountdown = normalizeCountdown(countdown);

  if (normalizedCountdown.date) {
    window.localStorage.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify(normalizedCountdown));
  } else {
    window.localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
  }
};

export const getGalleryPhotos = () => {
  if (typeof window === "undefined") return [];

  try {
    return normalizeGalleryPhotos(JSON.parse(window.localStorage.getItem(GALLERY_STORAGE_KEY) || "[]"));
  } catch {
    return [];
  }
};

export const saveGalleryPhotos = (photos) => {
  if (typeof window === "undefined") return [];
  const normalizedPhotos = normalizeGalleryPhotos(photos);

  if (normalizedPhotos.length) {
    window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(normalizedPhotos));
  } else {
    window.localStorage.removeItem(GALLERY_STORAGE_KEY);
  }

  return normalizedPhotos;
};

export const getSharedState = () =>
  normalizeSharedState({
    photo: getPhoto(),
    note: getNote(),
    reply: getReply(),
    countdown: getCountdown(),
    galleryPhotos: getGalleryPhotos(),
  });

export const saveSharedState = (sharedState) => {
  const normalizedState = normalizeSharedState(sharedState);

  savePhoto(normalizedState.photo);
  saveNote(normalizedState.note);
  saveReply(normalizedState.reply);
  saveCountdown(normalizedState.countdown);
  saveGalleryPhotos(normalizedState.galleryPhotos);

  return normalizedState;
};
