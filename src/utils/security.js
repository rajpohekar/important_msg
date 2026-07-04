export const SECURITY_SESSION_KEY = "little-miss-counter-session-unlocked";
const SECURITY_SESSION_VERSION = "fixed-passcode-v1";

const encoder = new TextEncoder();
const ITERATIONS = 150000;

const FIXED_SECURITY_RECORD = {
  version: 2,
  algorithm: "PBKDF2-SHA-256",
  iterations: ITERATIONS,
  salt: "1ezughgR1yM1VCyZfczKdg==",
  hash: "LD7tHm4MkqgKuuaHh4H6vxJpU99uhi8lJoRWLHmOEB8=",
};

const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));

const fromBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

export const isSecurityAvailable = () =>
  typeof window !== "undefined" && Boolean(window.crypto?.subtle && window.crypto?.getRandomValues);

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

export const getSecurityRecord = () => FIXED_SECURITY_RECORD;

export const verifyPasscode = async (passcode, record) => {
  if (!record?.salt || !record?.hash) return false;

  const hash = await deriveHash(passcode, record.salt, record.iterations || ITERATIONS);
  return hash === record.hash;
};

export const isSessionUnlocked = () =>
  window.sessionStorage.getItem(SECURITY_SESSION_KEY) === SECURITY_SESSION_VERSION;

export const markSessionUnlocked = () => {
  window.sessionStorage.setItem(SECURITY_SESSION_KEY, SECURITY_SESSION_VERSION);
};

export const clearSessionUnlock = () => {
  window.sessionStorage.removeItem(SECURITY_SESSION_KEY);
};
