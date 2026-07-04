export const SECURITY_STORAGE_KEY = "little-miss-counter-security";
export const SECURITY_SESSION_KEY = "little-miss-counter-session-unlocked";

const encoder = new TextEncoder();
const ITERATIONS = 150000;

const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));

const fromBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

export const isSecurityAvailable = () =>
  typeof window !== "undefined" && Boolean(window.crypto?.subtle && window.crypto?.getRandomValues);

export const isValidPasscode = (passcode) => /^\d{4,8}$/.test(passcode);

const deriveHash = async (passcode, salt, iterations = ITERATIONS) => {
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(passcode),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: fromBase64(salt),
      iterations,
    },
    keyMaterial,
    256,
  );

  return toBase64(new Uint8Array(bits));
};

export const getSecurityRecord = () => {
  try {
    const value = window.localStorage.getItem(SECURITY_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const createSecurityRecord = async (passcode) => {
  const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
  const salt = toBase64(saltBytes);
  const hash = await deriveHash(passcode, salt);

  return {
    version: 1,
    algorithm: "PBKDF2-SHA-256",
    iterations: ITERATIONS,
    salt,
    hash,
    createdAt: new Date().toISOString(),
  };
};

export const saveSecurityRecord = (record) => {
  window.localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(record));
};

export const verifyPasscode = async (passcode, record) => {
  if (!record?.salt || !record?.hash) return false;

  const hash = await deriveHash(passcode, record.salt, record.iterations || ITERATIONS);
  return hash === record.hash;
};

export const isSessionUnlocked = () =>
  window.sessionStorage.getItem(SECURITY_SESSION_KEY) === "true";

export const markSessionUnlocked = () => {
  window.sessionStorage.setItem(SECURITY_SESSION_KEY, "true");
};

export const clearSessionUnlock = () => {
  window.sessionStorage.removeItem(SECURITY_SESSION_KEY);
};
