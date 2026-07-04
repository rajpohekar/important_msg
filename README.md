# Little Miss Counter

A polished, private, local-first React mini app for saving the little moments when someone special crosses your mind.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Three Fiber, Three.js, and Drei
- Framer Motion
- Recharts
- Lucide React
- date-fns
- Firebase Firestore realtime sync
- localStorage persistence

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production Build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deploy To Vercel

This repo includes `vercel.json`.

Recommended Vercel settings:

- Framework preset: `Vite`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

## Deploy To Render

This repo includes `render.yaml` for a Static Site Blueprint.

Recommended Render settings if configuring manually:

- Service type: Static Site
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

## Quick Phone-To-Phone Sync

This app supports Firebase Firestore realtime sync. Without Firebase env vars, it safely falls back to local-only storage.

1. Create a Firebase project on the free Spark plan.
2. Enable Firestore Database.
3. Add a Web app in Firebase project settings.
4. Add these env vars to Vercel or Render:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_COUPLE_ID=raj-swamini
```

5. Use these quick Firestore rules for the shared couple document:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /littleMissCounter/raj-swamini {
      allow read, write: if true;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

For a stronger production lock, replace these quick rules with Firebase Auth/App Check later.

## Notes

- The app stores all moments locally in the browser under `little-miss-counter-moments`.
- The optional photo section stores one uploaded image locally under `little-miss-counter-us-photo`.
- When Firebase env vars are present, moments and the photo section sync through one Firestore document.
- The private lock uses a fixed local passcode check and stores only the current unlock session in `sessionStorage`.
- Vercel and Render configs include security headers for static deployment.
- There is no backend, login, database, messaging, notifications, or tracking.
- Demo data is loaded only on first use when no local data exists.
