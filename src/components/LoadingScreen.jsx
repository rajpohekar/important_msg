import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";

const LoadingScreen = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="fixed inset-0 z-[90] grid place-items-center bg-blush-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="flex items-center gap-3 rounded-full border border-white/80 bg-white/70 px-5 py-3 text-sm font-black text-cocoa-700 shadow-soft backdrop-blur-xl"
        >
          <Heart className="text-blush-500" size={18} fill="currentColor" aria-hidden="true" />
          Little Miss Counter
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default LoadingScreen;
