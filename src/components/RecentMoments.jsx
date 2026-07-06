import { Heart, ListCollapse, ListTree } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { formatExactMoment } from "../utils/dateUtils";

const RecentMoments = ({ moments }) => {
  const reduceMotion = useReducedMotion();
  const [showAll, setShowAll] = useState(false);
  const sortedMoments = useMemo(
    () => [...moments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [moments],
  );
  const visibleMoments = showAll ? sortedMoments : sortedMoments.slice(0, 10);
  const hasMore = sortedMoments.length > 10;
  const countLabel = showAll ? `${sortedMoments.length} total` : `Latest ${visibleMoments.length}`;

  return (
    <section className="rounded-lg border border-white/70 bg-white/48 p-4 shadow-soft backdrop-blur-2xl xs:p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-cocoa-700 md:text-2xl">
            Moment Log
          </h2>
          <p className="mt-1 text-sm font-semibold text-cocoa-600/75">
            Exact saved history
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-cocoa-600 shadow-soft">
            {countLabel}
          </span>
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((current) => !current)}
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-blush-300/70 bg-white/58 px-3 text-xs font-black text-blush-600 shadow-soft transition hover:-translate-y-0.5 hover:bg-blush-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush-400"
            >
              {showAll ? (
                <ListCollapse size={15} aria-hidden="true" />
              ) : (
                <ListTree size={15} aria-hidden="true" />
              )}
              {showAll ? "Latest 10" : "Complete Log"}
            </button>
          )}
        </div>
      </div>

      {sortedMoments.length === 0 ? (
        <div className="rounded-lg bg-white/58 p-4 text-sm font-bold text-cocoa-600">
          Your little moments will appear here soon 🌷
        </div>
      ) : (
        <motion.ol
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="relative space-y-3 pl-5"
        >
          <span className="absolute bottom-4 left-[9px] top-2 w-px bg-gradient-to-b from-blush-300 via-lavender-300 to-transparent" />
          {visibleMoments.map((moment, index) => (
            <motion.li
              key={moment.id}
              variants={{
                hidden: { opacity: 0, x: -12 },
                show: { opacity: 1, x: 0 },
              }}
              className="relative"
            >
              <span className="absolute -left-[21px] top-4 grid h-5 w-5 place-items-center rounded-full bg-blush-100 text-blush-500 ring-4 ring-white/70">
                <Heart size={11} fill="currentColor" aria-hidden="true" />
              </span>
              <div className="rounded-lg border border-white/72 bg-white/62 p-4 shadow-soft">
                <p className="text-sm font-black text-cocoa-700">
                  {formatExactMoment(moment.createdAt)}
                </p>
                <p className="mt-1 text-sm font-semibold text-cocoa-600/75">
                  Log #{sortedMoments.length - index} - You missed her
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      )}
    </section>
  );
};

export default RecentMoments;
