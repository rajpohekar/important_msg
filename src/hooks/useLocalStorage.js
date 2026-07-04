import { useCallback, useEffect, useState } from "react";
import { clearMoments, getMoments, saveMoment, STORAGE_KEY } from "../utils/storage";

export const useLocalStorage = () => {
  const [moments, setMoments] = useState(() => getMoments());

  const addMoment = useCallback(() => {
    const moment = saveMoment();
    setMoments(getMoments());
    return moment;
  }, []);

  const removeAllMoments = useCallback(() => {
    clearMoments();
    setMoments([]);
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setMoments(getMoments());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    moments,
    addMoment,
    clearMoments: removeAllMoments,
  };
};
