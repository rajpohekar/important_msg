import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatTooltipDate, getTodayKey } from "../utils/dateUtils";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_TITLE_LENGTH = 42;

const keyToUtcDay = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

const getCountdownDetails = (date) => {
  if (!date) return null;

  const difference = Math.round((keyToUtcDay(date) - keyToUtcDay(getTodayKey())) / MS_PER_DAY);
  const absoluteDays = Math.abs(difference);

  if (difference === 0) {
    return {
      value: "Today",
      label: "is the day",
    };
  }

  return {
    value: String(absoluteDays),
    label: difference > 0 ? `${absoluteDays === 1 ? "day" : "days"} to go` : `${absoluteDays === 1 ? "day" : "days"} since`,
  };
};

const CountdownCard = ({ countdown, syncStatus, onSaveCountdown, showToast }) => {
  const [titleDraft, setTitleDraft] = useState(countdown?.title || "Our special day");
  const [dateDraft, setDateDraft] = useState(countdown?.date || "");
  const reduceMotion = useReducedMotion();
  const details = useMemo(() => getCountdownDetails(countdown?.date), [countdown?.date]);
  const hasChanges =
    titleDraft.trim() !== (countdown?.title || "Our special day") || dateDraft !== (countdown?.date || "");

  useEffect(() => {
    setTitleDraft(countdown?.title || "Our special day");
    setDateDraft(countdown?.date || "");
  }, [countdown]);

  const handleSave = () => {
    onSaveCountdown({
      title: titleDraft.trim() || "Our special day",
      date: dateDraft,
    });
    showToast(
      syncStatus === "synced"
        ? "Your countdown is syncing to both phones 💗"
        : "Your countdown is saved here 💗",
    );
  };

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border border-white/75 bg-white/52 p-4 shadow-soft backdrop-blur-2xl xs:p-5 md:p-6"
      aria-labelledby="countdown-title"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-peach-200/80 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-cocoa-600">
            <CalendarDays size={14} aria-hidden="true" />
            Countdown
          </p>
          <h2 id="countdown-title" className="mt-3 text-2xl font-black leading-tight text-cocoa-700">
            {countdown?.title || "Special date"}
          </h2>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-peach-200 text-cocoa-700 shadow-soft">
          <Clock size={21} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-white/75 bg-white/62 p-4">
        {details ? (
          <>
            <p className="text-4xl font-black leading-none text-cocoa-700">{details.value}</p>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.14em] text-blush-600/80">
              {details.label}
            </p>
            <p className="mt-2 text-sm font-bold text-cocoa-600/75">{formatTooltipDate(countdown.date)}</p>
          </>
        ) : (
          <p className="text-sm font-bold leading-relaxed text-cocoa-600/78">
            Add the next date that matters.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-3">
        <input
          type="text"
          value={titleDraft}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(event) => setTitleDraft(event.target.value)}
          className="min-h-11 rounded-full border border-white/80 bg-white/68 px-4 text-sm font-black text-cocoa-700 shadow-inner outline-none transition placeholder:text-cocoa-600/42 focus:border-blush-300 focus:ring-2 focus:ring-blush-300/55"
          aria-label="Countdown title"
          placeholder="Our special day"
        />
        <div className="grid gap-3 xs:grid-cols-[1fr_auto]">
          <input
            type="date"
            value={dateDraft}
            onChange={(event) => setDateDraft(event.target.value)}
            className="min-h-11 rounded-full border border-white/80 bg-white/68 px-4 text-sm font-black text-cocoa-700 shadow-inner outline-none transition focus:border-blush-300 focus:ring-2 focus:ring-blush-300/55"
            aria-label="Countdown date"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!dateDraft || !hasChanges}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blush-500 to-peach-300 px-5 text-sm font-black text-white shadow-glow outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blush-400 disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Save size={16} aria-hidden="true" />
            Save
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default CountdownCard;
