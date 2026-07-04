import { AnimatePresence, motion } from "framer-motion";
import { HeartCrack, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

const ConfirmModal = ({ open, onCancel, onConfirm }) => {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-cocoa-700/18 p-4 backdrop-blur-sm md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onCancel();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-modal-title"
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="max-h-[min(86dvh,520px)] w-full max-w-md overflow-y-auto rounded-lg border border-white/75 bg-blush-50/95 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-glass backdrop-blur-2xl md:p-6"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-cocoa-600/15 md:hidden" />
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-blush-100 text-blush-600">
              <HeartCrack size={21} aria-hidden="true" />
            </div>
            <h2 id="clear-modal-title" className="text-xl font-black text-cocoa-700">
              Are you sure you want to clear your little moments?
            </h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-cocoa-600/82">
              This cannot be undone.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-cocoa-700 shadow-soft outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blush-400"
              >
                <ShieldCheck size={17} aria-hidden="true" />
                Keep My Moments
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="min-h-12 rounded-full border border-blush-300/80 bg-blush-100/72 px-5 text-sm font-black text-blush-600 outline-none transition hover:-translate-y-0.5 hover:bg-blush-200/65 focus-visible:ring-2 focus-visible:ring-blush-400"
              >
                Clear Everything
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
