import { useEffect, useState } from "react";

const hasTouch = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);

export const useMouseParallax = (targetRef, disabled = false) => {
  const [parallax, setParallax] = useState({ x: 0, y: 0, isTouch: true });

  useEffect(() => {
    const target = targetRef.current;
    const isTouch = hasTouch();
    setParallax((current) => ({ ...current, isTouch }));

    if (!target || disabled || isTouch) return undefined;

    const handlePointerMove = (event) => {
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      setParallax({ x, y, isTouch: false });
    };

    const reset = () => setParallax({ x: 0, y: 0, isTouch: false });

    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerleave", reset);

    return () => {
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerleave", reset);
    };
  }, [disabled, targetRef]);

  return parallax;
};
