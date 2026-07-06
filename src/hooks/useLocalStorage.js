import { useCallback, useEffect, useState } from "react";
import {
  isSupabaseSyncConfigured,
  replaceMomentsInCloud,
  saveSharedStateToCloud,
  subscribeToSharedState,
} from "../utils/supabaseSync";
import {
  COUNTDOWN_STORAGE_KEY,
  createMoment,
  getMoments,
  getSharedState,
  getStoredMoments,
  NOTE_STORAGE_KEY,
  normalizeMoments,
  normalizeSharedState,
  PHOTO_STORAGE_KEY,
  REPLY_STORAGE_KEY,
  saveSharedState,
  storeMoments,
  STORAGE_KEY,
} from "../utils/storage";

export const useLocalStorage = () => {
  const [moments, setMoments] = useState(() =>
    isSupabaseSyncConfigured() ? getStoredMoments() : getMoments(),
  );
  const [sharedState, setSharedState] = useState(() => getSharedState());
  const [syncStatus, setSyncStatus] = useState(() =>
    isSupabaseSyncConfigured() ? "connecting" : "local",
  );

  const addMoment = useCallback(() => {
    const moment = createMoment();
    const currentMoments = isSupabaseSyncConfigured() ? moments : getMoments();
    const nextMoments = normalizeMoments([moment, ...currentMoments]);

    storeMoments(nextMoments);
    setMoments(nextMoments);

    if (isSupabaseSyncConfigured()) {
      replaceMomentsInCloud(nextMoments)
        .then(() => setSyncStatus("synced"))
        .catch(() => setSyncStatus("offline"));
    }

    return moment;
  }, [moments]);

  const persistSharedState = useCallback((nextSharedState) => {
    const normalizedSharedState = saveSharedState(nextSharedState);
    setSharedState(normalizedSharedState);

    if (isSupabaseSyncConfigured()) {
      saveSharedStateToCloud(normalizedSharedState)
        .then(() => setSyncStatus("synced"))
        .catch(() => setSyncStatus("offline"));
    }

    return normalizedSharedState;
  }, []);

  const updatePhoto = useCallback(
    (nextPhoto) => persistSharedState({ ...sharedState, photo: nextPhoto || "" }),
    [persistSharedState, sharedState],
  );

  const removePhoto = useCallback(() => {
    updatePhoto("");
  }, [updatePhoto]);

  const updateNote = useCallback(
    (nextNote) => persistSharedState({ ...sharedState, note: nextNote || "" }),
    [persistSharedState, sharedState],
  );

  const sendReply = useCallback(
    (message) =>
      persistSharedState({
        ...sharedState,
        reply: {
          message,
          createdAt: new Date().toISOString(),
        },
      }),
    [persistSharedState, sharedState],
  );

  const updateCountdown = useCallback(
    (countdown) => persistSharedState({ ...sharedState, countdown }),
    [persistSharedState, sharedState],
  );

  useEffect(() => {
    if (!isSupabaseSyncConfigured()) return undefined;

    setSyncStatus("connecting");

    const unsubscribe = subscribeToSharedState(
      (remote) => {
        if (!remote.exists) {
          storeMoments([]);
          setMoments([]);
          setSharedState(saveSharedState(normalizeSharedState()));
          setSyncStatus("synced");
          return;
        }

        const remoteMoments = normalizeMoments(remote.moments);
        storeMoments(remoteMoments);
        setMoments(remoteMoments);

        if (remote.hasSharedState) {
          setSharedState(saveSharedState(remote.sharedState));
        }

        setSyncStatus("synced");
      },
      () => setSyncStatus("offline"),
    );

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setMoments(isSupabaseSyncConfigured() ? getStoredMoments() : getMoments());
      }

      if (
        event.key === PHOTO_STORAGE_KEY ||
        event.key === NOTE_STORAGE_KEY ||
        event.key === REPLY_STORAGE_KEY ||
        event.key === COUNTDOWN_STORAGE_KEY
      ) {
        setSharedState(getSharedState());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    moments,
    photo: sharedState.photo,
    note: sharedState.note,
    reply: sharedState.reply,
    countdown: sharedState.countdown,
    syncStatus,
    addMoment,
    savePhoto: updatePhoto,
    clearPhoto: removePhoto,
    saveNote: updateNote,
    sendReply,
    saveCountdown: updateCountdown,
  };
};
