import { Sparkles, Trophy } from "lucide-react";
import GlassCard from "./GlassCard";

const MostThoughtfulDay = ({ insight }) => (
  <GlassCard className="relative overflow-hidden p-5 md:p-6">
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blush-400 via-peach-300 to-lavender-400" />
    <div className="flex gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-peach-300 to-blush-400 text-white shadow-glow">
        {insight ? <Trophy size={21} aria-hidden="true" /> : <Sparkles size={21} aria-hidden="true" />}
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cocoa-600/70">
          Most thoughtful day
        </p>
        {insight ? (
          <>
            <h2 className="mt-2 text-xl font-black leading-tight text-cocoa-700 md:text-2xl">
              Your most thoughtful day was {insight.dayName} 💗
            </h2>
            <p className="mt-2 text-sm font-semibold text-cocoa-600/82">
              You logged {insight.count} {insight.count === 1 ? "little moment" : "little moments"} on{" "}
              {insight.dateLabel}.
            </p>
          </>
        ) : (
          <p className="mt-2 text-lg font-black text-cocoa-700">
            Your little moments will appear here soon 🌷
          </p>
        )}
      </div>
    </div>
  </GlassCard>
);

export default MostThoughtfulDay;
