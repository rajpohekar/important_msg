import { BarChart3, Heart, Home, LockKeyhole, Music2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

const Header = ({ page, setPage, onLock }) => {
  const [musicOn, setMusicOn] = useState(false);
  const MusicIcon = musicOn ? Music2 : VolumeX;

  return (
    <header className="sticky top-0 z-40 border-white/60 bg-blush-50/72 px-4 pb-2 pt-[calc(0.7rem+env(safe-area-inset-top))] backdrop-blur-xl md:border-b md:px-6 md:py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setPage("home")}
          className="group flex min-h-11 items-center gap-2 rounded-full pr-2 text-left text-cocoa-700 outline-none transition focus-visible:ring-2 focus-visible:ring-blush-400"
          aria-label="Go to Home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white/78 text-blush-500 shadow-soft transition group-hover:scale-105">
            <Heart size={19} fill="currentColor" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[15px] font-black leading-tight md:text-lg">Little Miss Counter</span>
            <span className="block text-xs font-semibold text-cocoa-600/75 md:hidden">Every small thought counts</span>
          </span>
        </button>

        <nav className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/54 p-1 shadow-soft backdrop-blur-xl md:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = page === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPage(tab.id)}
                className={`relative flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-bold transition outline-none focus-visible:ring-2 focus-visible:ring-blush-400 ${
                  active ? "text-cocoa-700" : "text-cocoa-600/70 hover:text-cocoa-700"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="desktop-active-tab"
                    className="absolute inset-0 rounded-full bg-blush-100 shadow-soft"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon className="relative z-10" size={17} aria-hidden="true" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onLock?.()}
            className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/70 bg-white/62 px-3 text-sm font-bold text-cocoa-600 shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-cocoa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 lg:px-4"
            aria-label="Lock Little Miss Counter"
            title="Lock app"
          >
            <LockKeyhole size={17} aria-hidden="true" />
            <span className="hidden lg:inline">Lock</span>
          </button>
          <button
            type="button"
            onClick={() => setMusicOn((value) => !value)}
            className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/70 bg-white/62 px-3 text-sm font-bold text-cocoa-600 shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:text-cocoa-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 md:px-4"
            aria-pressed={musicOn}
            aria-label="Toggle soft background music visual"
            title="Soft background music toggle"
          >
            <MusicIcon size={17} aria-hidden="true" />
            <span className="hidden md:inline">{musicOn ? "Soft hum" : "Quiet"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
