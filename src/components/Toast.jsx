import { AnimatePresence, motion } from "framer-motion";

const Toast = ({ toasts }) => (
  <div
    className="fixed bottom-[calc(96px+env(safe-area-inset-bottom))] left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col items-center gap-2 md:bottom-auto md:top-6"
    aria-live="polite"
    aria-atomic="true"
  >
    <AnimatePresence initial={false}>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="w-fit rounded-full border border-white/80 bg-white/82 px-4 py-3 text-center text-sm font-bold text-cocoa-700 shadow-glass backdrop-blur-2xl"
        >
          {toast.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default Toast;
