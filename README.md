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
- Supabase realtime sync
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

This app supports Supabase realtime sync. Without Supabase env vars, it safely falls back to local-only storage.

1. Create/open a Supabase project.
2. Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.little_miss_counter (
  id text primary key,
  moments jsonb not null default '[]'::jsonb,
  photo text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.little_miss_counter enable row level security;

create policy "couple read"
on public.little_miss_counter for select
using (id = 'raj-swamini');

create policy "couple insert"
on public.little_miss_counter for insert
with check (id = 'raj-swamini');

create policy "couple update"
on public.little_miss_counter for update
using (id = 'raj-swamini')
with check (id = 'raj-swamini');

alter publication supabase_realtime add table public.little_miss_counter;
```

3. Add these env vars to Supabase/Vercel/Render:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_COUPLE_ID=raj-swamini
```

## Notes

- The app stores all moments locally in the browser under `little-miss-counter-moments`.
- The optional photo section stores one uploaded image locally under `little-miss-counter-us-photo`.
- When Supabase env vars are present, moments and the photo section sync through one shared Supabase row.
- The private lock uses a fixed local passcode check and stores only the current unlock session in `sessionStorage`.
- Vercel and Render configs include security headers for static deployment.
- There is no backend, login, database, messaging, notifications, or tracking.
- Demo data is loaded only on first use when no local data exists.
