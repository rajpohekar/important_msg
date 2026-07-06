import { motion, useReducedMotion } from "framer-motion";
import { PenLine, Save } from "lucide-react";
import { useEffect, useState } from "react";

const MAX_NOTE_LENGTH = 700;

const PrivateNoteCard = ({ note, syncStatus, onSaveNote, showToast }) => {
  const [draft, setDraft] = useState(note || "");
  const reduceMotion = useReducedMotion();
  const hasChanges = draft !== (note || "");

  useEffect(() => {
    setDraft(note || "");
  }, [note]);

  const handleSave = () => {
    onSaveNote(draft.trim());
    showToast(
      syncStatus === "synced"
        ? "Your private note is syncing to both phones 💗"
        : "Your private note is saved here 💗",
    );
  };

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border border-white/75 bg-white/52 p-4 shadow-soft backdrop-blur-2xl xs:p-5 md:p-6"
      aria-labelledby="private-note-title"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blush-100/72 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blush-600">
            <PenLine size={14} aria-hidden="true" />
            Private note
          </p>
          <h2 id="private-note-title" className="mt-3 text-2xl font-black leading-tight text-cocoa-700">
            For miniiiii
          </h2>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-cocoa-600 shadow-soft">
          {draft.length}/{MAX_NOTE_LENGTH}
        </span>
      </div>

      <textarea
        value={draft}
        maxLength={MAX_NOTE_LENGTH}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="A tiny private note..."
        className="min-h-[156px] w-full resize-none rounded-lg border border-white/80 bg-white/68 p-4 text-base font-bold leading-relaxed text-cocoa-700 shadow-inner outline-none transition placeholder:text-cocoa-600/42 focus:border-blush-300 focus:ring-2 focus:ring-blush-300/55"
        aria-label="Private note"
      />

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blush-500 to-peach-300 px-5 text-sm font-black text-white shadow-glow outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blush-400 disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <Save size={17} aria-hidden="true" />
          {hasChanges ? "Save Note" : "Saved"}
        </button>
      </div>
    </motion.section>
  );
};

export default PrivateNoteCard;
