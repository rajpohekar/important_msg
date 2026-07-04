import { Flower2, Moon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { getDailyQuote } from "../utils/quotes";

const CuteQuote = () => {
  const quote = getDailyQuote();
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="relative overflow-hidden rounded-lg border border-white/70 bg-white/55 p-5 shadow-soft backdrop-blur-2xl"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rotate-12 rounded-[2rem] bg-lavender-300/30 blur-2xl" />
      <div className="relative flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lavender-200 text-blush-600">
          <Moon size={18} aria-hidden="true" />
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cocoa-600/70">
            <Flower2 size={14} aria-hidden="true" />
            Today&apos;s soft thought
          </div>
          <p className="text-base font-semibold leading-relaxed text-cocoa-700 md:text-lg">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default CuteQuote;
