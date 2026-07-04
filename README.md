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

## Notes

- The app stores all moments locally in the browser under `little-miss-counter-moments`.
- The optional photo section stores one uploaded image locally under `little-miss-counter-us-photo`.
- The private lock uses a local passcode hash stored under `little-miss-counter-security`.
- Vercel and Render configs include security headers for static deployment.
- There is no backend, login, database, messaging, notifications, or tracking.
- Demo data is loaded only on first use when no local data exists.
