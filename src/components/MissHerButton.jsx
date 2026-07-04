import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const MissHerButton = ({ onClick }) => {
  const locked = useRef(false);
  const reduceMotion = useReducedMotion();

  const handleClick = () => {
    if (locked.current) return;

    locked.current = true;
    onClick();

    window.setTimeout(() => {
      locked.current = false;
    }, 240);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.965, y: 2 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      animate={
        reduceMotion
          ? undefined
          : {
              scale: [1, 1.018, 1],
              boxShadow: [
                "0 18px 42px rgba(255,157,185,0.34)",
                "0 24px 58px rgba(255,157,185,0.48)",
                "0 18px 42px rgba(255,157,185,0.34)",
              ],
            }
      }
      transition={{
        scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
        boxShadow: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
      }}
      className="relative inline-flex min-h-[60px] min-w-[220px] items-center justify-center gap-3 overflow-hidden rounded-full border border-white/80 bg-gradient-to-r from-blush-500 via-blush-400 to-peach-300 px-8 py-4 text-[1.05rem] font-black text-white shadow-glow outline-none transition focus-visible:ring-4 focus-visible:ring-blush-300/70 xs:min-w-[250px] md:min-h-[68px] md:min-w-[290px] md:text-lg"
      aria-label="Save a little moment"
      data-testid="miss-her-button"
    >
      <span className="absolute inset-x-4 top-0 h-px bg-white/80" aria-hidden="true" />
      <span className="absolute -left-10 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-white/18 blur-2xl" />
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/22">
        <Heart size={19} fill="currentColor" aria-hidden="true" />
      </span>
      <span> I Miss Her</span>
    </motion.button>
  );
};

export default MissHerButton;
