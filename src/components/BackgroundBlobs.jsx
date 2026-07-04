import { motion, useReducedMotion } from "framer-motion";

const accents = [
  { symbol: "✦", className: "left-[8%] top-[18%] text-blush-400/35" },
  { symbol: "✧", className: "right-[9%] top-[28%] text-lavender-400/45" },
  { symbol: "♥", className: "left-[12%] bottom-[20%] text-peach-400/40" },
  { symbol: "♡", className: "right-[10%] top-[36%] text-blush-500/28" },
];

const BackgroundBlobs = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#FFF7FB_0%,#FFF1F6_42%,#FCF7FF_72%,#FFE6DD_100%)]" />
      <div className="mesh-wash absolute inset-0 opacity-90" />
      <div className="aurora-ribbon aurora-ribbon-one" />
      <div className="aurora-ribbon aurora-ribbon-two" />
      {accents.map((accent, index) => (
        <motion.span
          key={accent.symbol + index}
          className={`absolute text-2xl ${accent.className}`}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -10, 0],
                  rotate: [0, 7, 0],
                  opacity: [0.35, 0.65, 0.35],
                }
          }
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
        >
          {accent.symbol}
        </motion.span>
      ))}
    </div>
  );
};

export default BackgroundBlobs;
