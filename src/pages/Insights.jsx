import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import AnimatedCounter from "../components/AnimatedCounter";
import ConfirmModal from "../components/ConfirmModal";
import GlassCard from "../components/GlassCard";
import MonthlyLineChart from "../components/MonthlyLineChart";
import MostThoughtfulDay from "../components/MostThoughtfulDay";
import RecentMoments from "../components/RecentMoments";
import WeeklyBarChart from "../components/WeeklyBarChart";
import {
  getMonthlyCount,
  getMonthlyData,
  getMostThoughtfulDay,
  getRecentMoments,
  getWeeklyData,
} from "../utils/statsUtils";

const Insights = ({ moments, onClearMoments, showToast }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const stats = useMemo(
    () => ({
      monthlyCount: getMonthlyCount(moments),
      weeklyData: getWeeklyData(moments),
      monthlyData: getMonthlyData(moments),
      thoughtfulDay: getMostThoughtfulDay(moments),
      recentMoments: getRecentMoments(moments),
    }),
    [moments],
  );

  const handleClear = () => {
    onClearMoments();
    setConfirmOpen(false);
    showToast("Your little moments have been cleared.");
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-6xl"
    >
      <section className="pt-3 md:pt-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/54 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blush-600 shadow-soft backdrop-blur-xl">
          <Sparkles size={14} aria-hidden="true" />
          Gentle insights
        </p>
        <h1 className="text-3xl font-black leading-tight text-cocoa-700 xs:text-4xl md:text-5xl">
          My Little Moments 🌷
        </h1>
        <p className="mt-2 max-w-2xl text-base font-bold leading-relaxed text-cocoa-600/82 md:text-lg">
          A gentle look at the little times she crossed your mind.
        </p>
      </section>

      <GlassCard className="relative mt-6 overflow-hidden bg-gradient-to-br from-blush-100/80 via-white/58 to-lavender-200/72 p-5 md:mt-8 md:p-7">
        <div className="absolute inset-0 moving-sheen opacity-60" />
        {!reduceMotion && (
          <AnimatePresence>
            {["💗", "✦", "♡", "✧"].map((item, index) => (
              <motion.span
                key={item + index}
                className="absolute select-none text-xl text-blush-400/45"
                style={{
                  left: `${18 + index * 18}%`,
                  top: `${14 + (index % 2) * 52}%`,
                }}
                animate={{ y: [0, -9, 0], opacity: [0.25, 0.64, 0.25] }}
                transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {item}
              </motion.span>
            ))}
          </AnimatePresence>
        )}
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cocoa-600/70">
              This month, you thought of her
            </p>
            <p className="mt-3 flex items-end gap-3 text-cocoa-700">
              <AnimatedCounter value={stats.monthlyCount} className="text-6xl font-black leading-none md:text-7xl" />
              <span className="pb-2 text-2xl font-black">times 💗</span>
            </p>
          </div>
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white/72 text-blush-500 shadow-glow">
            <Heart size={34} fill="currentColor" aria-hidden="true" />
          </div>
        </div>
      </GlassCard>

      <section className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[0.92fr_1.08fr]">
        <WeeklyBarChart data={stats.weeklyData} />
        <MostThoughtfulDay insight={stats.thoughtfulDay} />
      </section>

      <section className="mt-5 md:mt-6">
        <MonthlyLineChart data={stats.monthlyData} />
      </section>

      <section className="mt-5 md:mt-6">
        <RecentMoments moments={stats.recentMoments} />
      </section>

      <section className="mt-7 flex justify-center md:mt-9">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-blush-300/70 bg-white/44 px-5 text-sm font-black text-cocoa-600 shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-blush-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush-400"
        >
          <Trash2 size={17} aria-hidden="true" />
          Clear All Moments
        </button>
      </section>

      <ConfirmModal open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={handleClear} />
    </motion.div>
  );
};

export default Insights;
