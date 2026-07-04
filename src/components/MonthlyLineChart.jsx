import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GlassCard from "./GlassCard";
import { formatTooltipDate } from "../utils/dateUtils";

const MonthlyTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-white/80 bg-white/92 px-3 py-2 text-sm font-bold text-cocoa-700 shadow-soft">
      <p>{formatTooltipDate(item.date)}</p>
      <p className="text-blush-600">{item.count} little moments</p>
    </div>
  );
};

const MonthlyLineChart = ({ data }) => {
  const chartWidth = Math.max(data.length * 34, 680);

  return (
    <GlassCard className="p-4 xs:p-5 md:p-6" hover={false}>
      <div className="mb-4">
        <h2 className="text-xl font-black text-cocoa-700 md:text-2xl">
          Your Month of Small Thoughts 💗
        </h2>
        <p className="mt-1 text-sm font-semibold text-cocoa-600/75">
          Daily moments in the current month
        </p>
      </div>

      <div className="chart-scroll -mx-2 overflow-x-auto px-2 pb-2">
        <div className="h-[250px] md:h-[280px]" style={{ minWidth: `${chartWidth}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 14, right: 16, left: -20, bottom: 2 }}>
              <defs>
                <linearGradient id="monthlyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F58FB1" stopOpacity={0.38} />
                  <stop offset="90%" stopColor="#F58FB1" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F6DDE8" strokeDasharray="4 8" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={{ fill: "#7B5C6C", fontSize: 11, fontWeight: 800 }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9B7E8D", fontSize: 12, fontWeight: 700 }}
                width={34}
              />
              <Tooltip cursor={{ stroke: "#F58FB1", strokeWidth: 1.5 }} content={<MonthlyTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#F58FB1"
                strokeWidth={3}
                fill="url(#monthlyAreaGradient)"
                activeDot={{ r: 6, stroke: "#FFFFFF", strokeWidth: 3, fill: "#F58FB1" }}
                dot={{ r: 3, stroke: "#FFFFFF", strokeWidth: 2, fill: "#F58FB1" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
};

export default MonthlyLineChart;
