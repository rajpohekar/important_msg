import { initializeApp } from "firebase/app";
import {
  arrayUnion,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { normalizeMoments } from "./storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const coupleId = import.meta.env.VITE_COUPLE_ID || "raj-swamini";

let app;
let db;

export const isFirebaseSyncConfigured = () =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);

const getDb = () => {
  if (!isFirebaseSyncConfigured()) return null;

  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }

  return db;
};

const getCoupleDoc = () => {
  const firestore = getDb();
  return firestore ? doc(firestore, "littleMissCounter", coupleId) : null;
};

export const subscribeToSharedState = (onData, onError) => {
  const docRef = getCoupleDoc();
  if (!docRef) return null;

  return onSnapshot(
    docRef,
    (snapshot) => {
      const data = snapshot.exists() ? snapshot.data() : {};
      onData({
        exists: snapshot.exists(),
        moments: normalizeMoments(data.moments || []),
        photo: typeof data.photo === "string" ? data.photo : "",
        hasPhoto: Object.prototype.hasOwnProperty.call(data, "photo"),
      });
    },
    onError,
  );
};

export const seedSharedState = (moments, photo) => {
  const docRef = getCoupleDoc();
  if (!docRef) return Promise.resolve();

  return setDoc(
    docRef,
    {
      moments: normalizeMoments(moments),
      photo: photo || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const pushMomentToCloud = (moment) => {
  const docRef = getCoupleDoc();
  if (!docRef) return Promise.resolve();

  return setDoc(
    docRef,
    {
      moments: arrayUnion(moment),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const replaceMomentsInCloud = (moments) => {
  const docRef = getCoupleDoc();
  if (!docRef) return Promise.resolve();

  return setDoc(
    docRef,
    {
      moments: normalizeMoments(moments),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

export const savePhotoToCloud = (photo) => {
  const docRef = getCoupleDoc();
  if (!docRef) return Promise.resolve();

  return setDoc(
    docRef,
    {
      photo: photo || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
