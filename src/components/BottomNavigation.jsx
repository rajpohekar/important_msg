import { BarChart3, Heart } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "home", label: "Home", icon: Heart },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

const BottomNavigation = ({ page, setPage }) => (
  <nav
    className="fixed inset-x-0 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-sm items-center justify-between rounded-full border border-white/75 bg-white/72 p-1.5 shadow-glass backdrop-blur-2xl md:hidden"
    style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
    aria-label="Primary navigation"
  >
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const active = page === tab.id;

      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => setPage(tab.id)}
          className={`relative flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-black transition outline-none focus-visible:ring-2 focus-visible:ring-blush-400 ${
            active ? "text-cocoa-700" : "text-cocoa-600/58"
          }`}
          aria-current={active ? "page" : undefined}
        >
          {active && (
            <motion.span
              layoutId="mobile-active-tab"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blush-100 to-peach-200 shadow-soft"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <Icon className="relative z-10" size={18} fill={active && tab.id === "home" ? "currentColor" : "none"} />
          <span className="relative z-10">{tab.label}</span>
        </button>
      );
    })}
  </nav>
);

export default BottomNavigation;
