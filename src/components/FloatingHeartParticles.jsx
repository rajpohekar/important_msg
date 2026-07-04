import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export const createHeartBurst = () => {
  const count = 6 + Math.floor(Math.random() * 5);

  return Array.from({ length: count }, (_, index) => ({
    id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
    x: (Math.random() - 0.5) * 170,
    y: 78 + Math.random() * 80,
    rotate: (Math.random() - 0.5) * 38,
    size: 16 + Math.random() * 13,
    delay: Math.random() * 0.12,
    sparkle: Math.random() > 0.66,
  }));
};

const FloatingHeartParticles = ({ particles }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden="true">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute left-1/2 top-1/2 select-none drop-shadow-sm"
            initial={{ x: -8, y: 6, scale: 0.45, opacity: 0, rotate: 0 }}
            animate={{
              x: particle.x,
              y: -particle.y,
              scale: [0.5, 1, 0.86],
              opacity: [0, 1, 0],
              rotate: particle.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.25,
              delay: particle.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontSize: particle.size,
            }}
          >
            {particle.sparkle ? "✦" : "💗"}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingHeartParticles;
