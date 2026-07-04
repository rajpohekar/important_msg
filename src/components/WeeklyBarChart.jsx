import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GlassCard from "./GlassCard";

const WeeklyTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/80 bg-white/92 px-3 py-2 text-sm font-bold text-cocoa-700 shadow-soft">
      <p>{label}</p>
      <p className="text-blush-600">{payload[0].value} little moments</p>
    </div>
  );
};

const WeeklyBarChart = ({ data }) => (
  <GlassCard className="p-4 xs:p-5 md:p-6" hover={false}>
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-cocoa-700 md:text-2xl">
          This Week&apos;s Little Moments
        </h2>
        <p className="mt-1 text-sm font-semibold text-cocoa-600/75">Monday through Sunday</p>
      </div>
      <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-black text-blush-600">7 days</span>
    </div>

    <div className="h-[240px] w-full xs:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weeklyBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F58FB1" />
              <stop offset="100%" stopColor="#D9C6FF" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#F6DDE8" strokeDasharray="4 8" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7B5C6C", fontSize: 12, fontWeight: 800 }}
            dy={8}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9B7E8D", fontSize: 12, fontWeight: 700 }}
            width={34}
          />
          <Tooltip cursor={{ fill: "rgba(255, 157, 185, 0.12)" }} content={<WeeklyTooltip />} />
          <Bar dataKey="count" fill="url(#weeklyBarGradient)" radius={[10, 10, 6, 6]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </GlassCard>
);

export default WeeklyBarChart;
