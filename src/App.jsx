import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import BackgroundBlobs from "./components/BackgroundBlobs";
import BottomNavigation from "./components/BottomNavigation";
import Header from "./components/Header";
import LoadingScreen from "./components/LoadingScreen";
import SecurityGate from "./components/SecurityGate";
import Toast from "./components/Toast";
import { useLocalStorage } from "./hooks/useLocalStorage";

const Home = lazy(() => import("./pages/Home"));
const Insights = lazy(() => import("./pages/Insights"));

const PageFallback = () => (
  <div className="mx-auto grid min-h-[52dvh] w-full max-w-6xl place-items-center">
    <div className="rounded-full border border-white/80 bg-white/62 px-5 py-3 text-sm font-black text-cocoa-600 shadow-soft backdrop-blur-xl">
      Loading softly...
    </div>
  </div>
);

const App = () => {
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const cursorGlow = useRef(null);
  const { moments, photo, syncStatus, addMoment, clearMoments, savePhoto, clearPhoto } = useLocalStorage();

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 360);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    if (!media.matches) return undefined;

    const handlePointerMove = (event) => {
      if (!cursorGlow.current) return;
      cursorGlow.current.style.setProperty("--cursor-x", `${event.clientX}px`);
      cursorGlow.current.style.setProperty("--cursor-y", `${event.clientY}px`);
      cursorGlow.current.style.opacity = "1";
    };

    const handlePointerLeave = () => {
      if (cursorGlow.current) cursorGlow.current.style.opacity = "0";
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.body.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.body.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const showToast = useCallback((message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current.slice(-2), { id, message }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2100);
  }, []);

  return (
    <>
      <BackgroundBlobs />
      <div ref={cursorGlow} className="cursor-glow" aria-hidden="true" />
      <LoadingScreen show={loading} />
      <SecurityGate showToast={showToast}>
        {({ lockApp }) => (
          <div className="relative min-h-[100dvh] overflow-x-hidden">
            <Header page={page} setPage={setPage} onLock={lockApp} />
            <main className="px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-2 xs:px-5 md:px-6 md:pb-14 md:pt-0">
              <Suspense fallback={<PageFallback />}>
                <AnimatePresence mode="wait">
                  {page === "home" ? (
                    <Home
                      key="home"
                      moments={moments}
                      photo={photo}
                      syncStatus={syncStatus}
                      onAddMoment={addMoment}
                      onSavePhoto={savePhoto}
                      onClearPhoto={clearPhoto}
                      showToast={showToast}
                    />
                  ) : (
                    <Insights
                      key="insights"
                      moments={moments}
                      onClearMoments={clearMoments}
                      showToast={showToast}
                    />
                  )}
                </AnimatePresence>
              </Suspense>
            </main>
            <BottomNavigation page={page} setPage={setPage} />
          </div>
        )}
      </SecurityGate>
      <Toast toasts={toasts} />
    </>
  );
};

export default App;
