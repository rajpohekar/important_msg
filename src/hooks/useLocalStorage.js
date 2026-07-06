import { useCallback, useEffect, useState } from "react";
import {
  isSupabaseSyncConfigured,
  replaceMomentsInCloud,
  savePhotoToCloud,
  subscribeToSharedState,
} from "../utils/supabaseSync";
import {
  createMoment,
  getMoments,
  getPhoto,
  getStoredMoments,
  normalizeMoments,
  PHOTO_STORAGE_KEY,
  savePhoto,
  storeMoments,
  STORAGE_KEY,
} from "../utils/storage";

export const useLocalStorage = () => {
  const [moments, setMoments] = useState(() =>
    isSupabaseSyncConfigured() ? getStoredMoments() : getMoments(),
  );
  const [photo, setPhoto] = useState(() => getPhoto());
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
        if (!remote.exists) {
          storeMoments([]);
          setMoments([]);
          setSyncStatus("synced");
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
        setMoments(isSupabaseSyncConfigured() ? getStoredMoments() : getMoments());
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
    savePhoto: updatePhoto,
    clearPhoto: removePhoto,
  };
};
