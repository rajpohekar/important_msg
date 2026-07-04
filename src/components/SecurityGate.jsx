import { Heart, KeyRound, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearSessionUnlock,
  createSecurityRecord,
  getSecurityRecord,
  isSecurityAvailable,
  isSessionUnlocked,
  isValidPasscode,
  markSessionUnlocked,
  saveSecurityRecord,
  verifyPasscode,
} from "../utils/security";

const AUTO_LOCK_AFTER_MS = 30000;
const THROTTLE_AFTER_ATTEMPTS = 5;
const THROTTLE_MS = 30000;

const SecurityField = ({ label, value, onChange, placeholder = "4-8 digits", autoFocus = false }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-black text-cocoa-700">{label}</span>
    <input
      type="password"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={8}
      autoFocus={autoFocus}
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 8))}
      placeholder={placeholder}
      className="h-14 w-full rounded-full border border-white/80 bg-white/72 px-5 text-center text-xl font-black tracking-[0.3em] text-cocoa-700 shadow-soft outline-none backdrop-blur-xl transition placeholder:text-cocoa-600/26 focus:border-blush-300 focus:ring-4 focus:ring-blush-200/70"
      aria-label={label}
    />
  </label>
);

const SecurityGate = ({ children, showToast }) => {
  const [status, setStatus] = useState("checking");
  const [passcode, setPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const hiddenAt = useRef(0);
  const reduceMotion = useReducedMotion();

  const lockApp = useCallback(
    (silent = false) => {
      clearSessionUnlock();
      setPasscode("");
      setConfirmPasscode("");
      setError("");
      setStatus(getSecurityRecord() ? "unlock" : "setup");
      if (!silent) showToast("Little Miss Counter is locked.");
    },
    [showToast],
  );

  useEffect(() => {
    if (!isSecurityAvailable()) {
      setStatus("unsupported");
      return;
    }

    const record = getSecurityRecord();
    setStatus(!record ? "setup" : isSessionUnlocked() ? "ready" : "unlock");
  }, []);

  useEffect(() => {
    if (!lockedUntil) return undefined;

    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  useEffect(() => {
    if (status !== "ready") return undefined;

    const handleVisibility = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
        return;
      }

      if (hiddenAt.current && Date.now() - hiddenAt.current > AUTO_LOCK_AFTER_MS) {
        lockApp(true);
      }

      hiddenAt.current = 0;
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [lockApp, status]);

  const handleSetup = async (event) => {
    event.preventDefault();
    setError("");

    if (!isValidPasscode(passcode)) {
      setError("Use a private 4-8 digit passcode.");
      return;
    }

    if (passcode !== confirmPasscode) {
      setError("Both passcodes should match.");
      return;
    }

    setIsBusy(true);

    try {
      const record = await createSecurityRecord(passcode);
      saveSecurityRecord(record);
      markSessionUnlocked();
      setStatus("ready");
      setPasscode("");
      setConfirmPasscode("");
      showToast("Private lock is ready 💗");
    } catch {
      setError("The private lock could not be created yet.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleUnlock = async (event) => {
    event.preventDefault();
    setError("");

    if (lockedUntil > Date.now()) return;

    const record = getSecurityRecord();

    if (!record) {
      setStatus("setup");
      return;
    }

    setIsBusy(true);

    try {
      const allowed = await verifyPasscode(passcode, record);

      if (allowed) {
        markSessionUnlocked();
        setStatus("ready");
        setPasscode("");
        setAttempts(0);
        setLockedUntil(0);
        showToast("Unlocked privately 💗");
        return;
      }

      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setPasscode("");

      if (nextAttempts >= THROTTLE_AFTER_ATTEMPTS) {
        setLockedUntil(Date.now() + THROTTLE_MS);
        setNow(Date.now());
        setError("Too many tries. Pause for a few seconds.");
      } else {
        setError("That passcode did not open it. Try gently again.");
      }
    } catch {
      setError("The private lock could not be checked yet.");
    } finally {
      setIsBusy(false);
    }
  };

  if (status === "ready") {
    return typeof children === "function" ? children({ lockApp }) : children;
  }

  const isSetup = status === "setup";
  const secondsLeft = lockedUntil > now ? Math.ceil((lockedUntil - now) / 1000) : 0;

  return (
    <main className="grid min-h-[100dvh] place-items-center px-4 py-[calc(1.25rem+env(safe-area-inset-top))]">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-lg border border-white/75 bg-white/62 p-5 shadow-glass backdrop-blur-2xl xs:p-6"
      >
        <div className="absolute -right-16 top-8 h-36 w-36 rounded-full bg-blush-300/28 blur-3xl" />
        <div className="absolute -left-16 bottom-4 h-32 w-32 rounded-full bg-lavender-300/32 blur-3xl" />

        <div className="relative">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blush-400 to-peach-300 text-white shadow-glow">
            <LockKeyhole size={26} aria-hidden="true" />
          </div>

          <div className="mt-4 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-blush-100/72 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blush-600">
              <ShieldCheck size={14} aria-hidden="true" />
              Private little lock
            </p>
            <h1 className="mt-3 text-2xl font-black leading-tight text-cocoa-700 xs:text-3xl">
              {isSetup ? "Protect this little place" : "Little Miss Counter is locked"}
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-relaxed text-cocoa-600/78">
              {isSetup
                ? "Create a passcode for this device before your moments appear."
                : "Enter your passcode to see your soft little diary."}
            </p>
          </div>

          {status === "unsupported" ? (
            <div className="mt-6 rounded-lg bg-white/62 p-4 text-center text-sm font-bold leading-relaxed text-cocoa-600">
              This browser does not support the private lock yet.
            </div>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={isSetup ? handleSetup : handleUnlock}>
              <SecurityField
                label={isSetup ? "Create passcode" : "Passcode"}
                value={passcode}
                onChange={setPasscode}
                autoFocus
              />

              {isSetup && (
                <SecurityField
                  label="Confirm passcode"
                  value={confirmPasscode}
                  onChange={setConfirmPasscode}
                />
              )}

              {error && (
                <p className="rounded-lg bg-blush-100/66 px-4 py-3 text-center text-sm font-black text-blush-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isBusy || secondsLeft > 0}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blush-500 to-peach-300 px-5 text-sm font-black text-white shadow-glow outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blush-400 disabled:cursor-wait disabled:opacity-70"
              >
                {isSetup ? <Sparkles size={17} aria-hidden="true" /> : <KeyRound size={17} aria-hidden="true" />}
                {secondsLeft > 0 ? `Try again in ${secondsLeft}s` : isBusy ? "Checking..." : isSetup ? "Set Private Lock" : "Unlock"}
              </button>
            </form>
          )}

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs font-bold leading-relaxed text-cocoa-600/65">
            <Heart size={13} fill="currentColor" aria-hidden="true" />
            Your passcode and moments stay on this device.
          </p>
        </div>
      </motion.section>
    </main>
  );
};

export default SecurityGate;
