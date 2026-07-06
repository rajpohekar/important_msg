import AnimatedCounter from "./AnimatedCounter";
import GlassCard from "./GlassCard";

const StatsCard = ({ icon: Icon, label, detail, count, accent = "from-blush-400 to-peach-300", delay = 0 }) => {
  const noun = count === 1 ? "little moment" : "little moments";
  const ariaLabel = `${label}${detail ? `, ${detail}` : ""}: ${count} ${noun}`;

  return (
    <GlassCard className="group min-h-[112px] p-4 xs:p-5" delay={delay}>
      <div data-testid={`stat-${label.toLowerCase()}`} aria-label={ariaLabel}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-cocoa-600">{label}</p>
            {detail && <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-blush-600/80">{detail}</p>}
            <p className="mt-2 flex items-baseline gap-2 text-cocoa-700">
              <AnimatedCounter value={count} className="text-3xl font-black leading-none xs:text-4xl md:text-[2.6rem]" />
            </p>
            <p className="mt-1 text-sm font-medium text-cocoa-600/80">{noun}</p>
          </div>
          <div
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${accent} text-white shadow-glow transition-transform duration-300 group-hover:scale-105`}
            aria-hidden="true"
          >
            <Icon size={20} strokeWidth={2.4} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default StatsCard;
