import { motion, useReducedMotion } from "framer-motion";

const GlassCard = ({ children, className = "", delay = 0, hover = true }) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={!reduceMotion && hover ? { y: -4 } : undefined}
      className={`rounded-lg border border-white/70 bg-white/58 shadow-soft backdrop-blur-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
