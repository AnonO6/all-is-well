# All Is Well — Mental Wellness Tracker

A PWA for Indian exam students (NEET, JEE, CUET, CAT, GATE, UPSC, Board exams) to track mood, identify stress triggers, journal reflections, and access wellness support.

## Features

- **Daily Mood Check-In** — Multi-step flow with mood, energy, stress, and trigger tracking
- **Reflection Journal** — AI-generated prompts via OpenAI
- **Insights Dashboard** — Mood trends, trigger heatmaps, AI weekly summaries
- **Breathe & Relax** — Box breathing, 4-7-8 technique, guided meditation videos
- **Talk to Guru** — Hume EVI voice mentor for empathetic support

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- MySQL (Aiven) + Kysely
- NextAuth v5 (Google OAuth + credentials)
- OpenAI, Unsplash, YouTube APIs
- Hume AI EVI for voice
- Tailwind CSS + shadcn/ui
- PWA via `@ducanh2912/next-pwa`

## Setup

```bash
npm install
npm run migrate
npm run dev
```

## Environment Variables

See `.env` — required keys:

- `DATABASE_URL` — Aiven MySQL connection string
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `OPENAI_API_KEY_ONE`, `OPENAI_MODEL`
- `UNSPLASH_API_KEY`
- `YOUTUBE_API_KEY_ONE` (and optional TWO/THREE)
- `HUME_API_KEY`, `HUME_SECRET_KEY`, `NEXT_PUBLIC_HUME_CONFIG_ID` (for voice mentor)

## Deploy

Deploy to Vercel. Set all env vars in the Vercel dashboard. Update `NEXTAUTH_URL` to your production domain.
