import { CalendarDays, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { lazy, Suspense, useMemo, useState } from "react";
import CountdownCard from "../components/CountdownCard";
import CuteQuote from "../components/CuteQuote";
import FloatingHeartParticles, { createHeartBurst } from "../components/FloatingHeartParticles";
import MissHerButton from "../components/MissHerButton";
import PrivateNoteCard from "../components/PrivateNoteCard";
import ReplyButtonCard from "../components/ReplyButtonCard";
import StatsCard from "../components/StatsCard";
import UsPhotoSection from "../components/UsPhotoSection";
import {
  getMonthlyCount,
  getTodayCount,
  getWeeklyData,
} from "../utils/statsUtils";
import { getTodayDateLabel } from "../utils/dateUtils";

const HeroScene = lazy(() => import("../components/HeroScene"));
const MiniiWorld = lazy(() => import("../components/MiniiWorld"));

const HeroSceneFallback = () => (
  <figure className="mx-auto w-full max-w-xl">
    <div className="relative grid h-[220px] place-items-center overflow-hidden rounded-lg border border-white/75 bg-white/50 shadow-glass backdrop-blur-2xl xs:h-[238px] md:h-[300px] lg:h-[320px]">
      <div className="fallback-heart relative h-24 w-24 rotate-45 rounded-lg bg-gradient-to-br from-blush-400 to-peach-300 shadow-glow" />
    </div>
    <figcaption className="mt-3 text-center text-sm font-bold text-cocoa-600/80">
      Every small thought counts. 💗
    </figcaption>
  </figure>
);

const toastMessages = [
  "A little moment saved safely 💗",
  "She crossed your mind again 🌷",
  "Love lives in the little things.",
  "Your heart remembered her again ✨",
];

const Home = ({
  moments,
  photo,
  note,
  reply,
  countdown,
  galleryPhotos,
  syncStatus,
  onAddMoment,
  onSavePhoto,
  onClearPhoto,
  onSaveNote,
  onSendReply,
  onSaveCountdown,
  onAddGalleryPhotos,
  onRemoveGalleryPhoto,
  showToast,
}) => {
  const [particles, setParticles] = useState([]);
  const [worldOpen, setWorldOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const stats = useMemo(() => {
    const weeklyData = getWeeklyData(moments);
    return {
      today: getTodayCount(moments),
      week: weeklyData.reduce((sum, item) => sum + item.count, 0),
      month: getMonthlyCount(moments),
      todayDate: getTodayDateLabel(),
    };
  }, [moments]);

  const handleMissClick = () => {
    onAddMoment();

    if (!reduceMotion) {
      const burst = createHeartBurst();
      setParticles((current) => [...current, ...burst]);
      window.setTimeout(() => {
        setParticles((current) => current.filter((particle) => !burst.some((item) => item.id === particle.id)));
      }, 1500);
    }

    showToast(toastMessages[Math.floor(Math.random() * toastMessages.length)]);
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-6xl"
    >
      <section className="pt-3 text-center md:pt-8">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/54 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blush-600 shadow-soft backdrop-blur-xl"
        >
          <Sparkles size={14} aria-hidden="true" />
          Private little diary
        </motion.p>
        <h1 className="text-3xl font-black leading-tight text-cocoa-700 xs:text-4xl md:text-5xl">
          Little Miss Counter 💗
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-base font-bold leading-relaxed text-cocoa-600/82 md:text-lg">
          Every small thought counts.
        </p>
      </section>

      <div className="mt-5 md:mt-8">
        <Suspense fallback={<HeroSceneFallback />}>
          <HeroScene onOpenWorld={() => setWorldOpen(true)} />
        </Suspense>
      </div>

      <p className="mx-auto mt-3 max-w-md text-center text-sm font-semibold leading-relaxed text-cocoa-600/76 md:text-base">
        A small place for the moments she crosses your mind.
      </p>

      <section className="relative mt-7 flex justify-center md:mt-9" aria-label="Save a little moment">
        <FloatingHeartParticles particles={particles} />
        <MissHerButton onClick={handleMissClick} />
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-4" aria-label="Moment totals">
        <div className="col-span-2 md:col-span-1">
          <StatsCard
            icon={Heart}
            label="Today"
            detail={stats.todayDate}
            count={stats.today}
            accent="from-blush-500 to-blush-300"
            delay={0.04}
          />
        </div>
        <StatsCard
          icon={CalendarDays}
          label="Week"
          count={stats.week}
          accent="from-lavender-400 to-blush-300"
          delay={0.1}
        />
        <StatsCard
          icon={Sparkles}
          label="Month"
          count={stats.month}
          accent="from-peach-300 to-blush-400"
          delay={0.16}
        />
      </section>

      <section className="mt-5 grid gap-4 md:mt-6 lg:grid-cols-[1.05fr_0.95fr]">
        <PrivateNoteCard
          note={note}
          syncStatus={syncStatus}
          onSaveNote={onSaveNote}
          showToast={showToast}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          <ReplyButtonCard
            reply={reply}
            syncStatus={syncStatus}
            onSendReply={onSendReply}
            showToast={showToast}
          />
          <CountdownCard
            countdown={countdown}
            syncStatus={syncStatus}
            onSaveCountdown={onSaveCountdown}
            showToast={showToast}
          />
        </div>
      </section>

      <div className="mt-5 md:mt-6">
        <UsPhotoSection
          photo={photo}
          syncStatus={syncStatus}
          onSavePhoto={onSavePhoto}
          onClearPhoto={onClearPhoto}
          showToast={showToast}
        />
      </div>

      <div className="mt-5 md:mt-6">
        <CuteQuote />
      </div>

      <p className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-white/45 px-4 py-2 text-center text-xs font-bold text-cocoa-600/72 shadow-soft backdrop-blur-xl">
        <ShieldCheck size={14} aria-hidden="true" />
        {syncStatus === "synced"
          ? "Your little moments are syncing between both phones. 🔒"
          : "Your little moments stay privately on this device. 🔒"}
      </p>

      <Suspense fallback={null}>
        <MiniiWorld
          open={worldOpen}
          photo={photo}
          galleryPhotos={galleryPhotos}
          syncStatus={syncStatus}
          onClose={() => setWorldOpen(false)}
          onAddGalleryPhotos={onAddGalleryPhotos}
          onRemoveGalleryPhoto={onRemoveGalleryPhoto}
          showToast={showToast}
        />
      </Suspense>
    </motion.div>
  );
};

export default Home;
