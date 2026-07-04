import { useCallback, useEffect, useRef, useState } from "react";
import {
  isSupabaseSyncConfigured,
  replaceMomentsInCloud,
  savePhotoToCloud,
  seedSharedState,
  subscribeToSharedState,
} from "../utils/supabaseSync";
import {
  clearMoments,
  createMoment,
  getMoments,
  getPhoto,
  normalizeMoments,
  PHOTO_STORAGE_KEY,
  savePhoto,
  storeMoments,
  STORAGE_KEY,
} from "../utils/storage";

export const useLocalStorage = () => {
  const [moments, setMoments] = useState(() => getMoments());
  const [photo, setPhoto] = useState(() => getPhoto());
  const [syncStatus, setSyncStatus] = useState(() =>
    isSupabaseSyncConfigured() ? "connecting" : "local",
  );
  const initialSeedAttempted = useRef(false);

  const addMoment = useCallback(() => {
    const moment = createMoment();
    const nextMoments = normalizeMoments([moment, ...getMoments()]);

    storeMoments(nextMoments);
    setMoments(nextMoments);

    if (isSupabaseSyncConfigured()) {
      replaceMomentsInCloud(nextMoments)
        .then(() => setSyncStatus("synced"))
        .catch(() => setSyncStatus("offline"));
    }

    return moment;
  }, []);

  const removeAllMoments = useCallback(() => {
    clearMoments();
    setMoments([]);

    if (isSupabaseSyncConfigured()) {
      replaceMomentsInCloud([])
        .then(() => setSyncStatus("synced"))
        .catch(() => setSyncStatus("offline"));
    }
  }, []);

  const updatePhoto = useCallback((nextPhoto) => {
    savePhoto(nextPhoto);
    setPhoto(nextPhoto || "");

    if (isSupabaseSyncConfigured()) {
      savePhotoToCloud(nextPhoto || "")
        .then(() => setSyncStatus("synced"))
        .catch(() => setSyncStatus("offline"));
    }
  }, []);

  const removePhoto = useCallback(() => {
    updatePhoto("");
  }, [updatePhoto]);

  useEffect(() => {
    if (!isSupabaseSyncConfigured()) return undefined;

    setSyncStatus("connecting");

    const unsubscribe = subscribeToSharedState(
      (remote) => {
        if (!remote.exists && !initialSeedAttempted.current) {
          initialSeedAttempted.current = true;
          seedSharedState(getMoments(), getPhoto())
            .then(() => setSyncStatus("synced"))
            .catch(() => setSyncStatus("offline"));
          return;
        }

        const remoteMoments = normalizeMoments(remote.moments);
        storeMoments(remoteMoments);
        setMoments(remoteMoments);

        if (remote.hasPhoto) {
          savePhoto(remote.photo);
          setPhoto(remote.photo || "");
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
        setMoments(getMoments());
      }

      if (event.key === PHOTO_STORAGE_KEY) {
        setPhoto(getPhoto());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    moments,
    photo,
    syncStatus,
    addMoment,
    clearMoments: removeAllMoments,
    savePhoto: updatePhoto,
    clearPhoto: removePhoto,
  };
};
