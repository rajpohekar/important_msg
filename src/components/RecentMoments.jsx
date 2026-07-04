import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { formatTimelineMoment } from "../utils/dateUtils";

const RecentMoments = ({ moments }) => {
  const reduceMotion = useReducedMotion();

  return (
    <section className="rounded-lg border border-white/70 bg-white/48 p-4 shadow-soft backdrop-blur-2xl xs:p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-cocoa-700 md:text-2xl">
            Recent Moments
          </h2>
          <p className="mt-1 text-sm font-semibold text-cocoa-600/75">The latest little thoughts</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-cocoa-600 shadow-soft">
          Latest 10
        </span>
      </div>

      {moments.length === 0 ? (
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
          {moments.map((moment) => (
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
                  {formatTimelineMoment(moment.createdAt)}
                </p>
                <p className="mt-1 text-sm font-semibold text-cocoa-600/75">💗 You missed her</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      )}
    </section>
  );
};

export default RecentMoments;
