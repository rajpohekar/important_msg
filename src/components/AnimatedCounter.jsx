import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({ value, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value);
      previousValue.current = value;
      return undefined;
    }

    const controls = animate(previousValue.current, value, {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    previousValue.current = value;
    return () => controls.stop();
  }, [reduceMotion, value]);

  return <span className={className}>{displayValue}</span>;
};

export default AnimatedCounter;
