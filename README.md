# All Is Well

<img width="1086" height="1448" alt="All Is Well app preview" src="https://github.com/user-attachments/assets/beb52ee9-a9f8-41b1-9766-8ee7c6a54266" />

**A chill mental wellness companion for Indian exam students** — track mood, reflect on stress, breathe, and talk to **Guru** (your Rancho-from-3-Idiots-style voice mentor). Built as a **Progressive Web App (PWA)** that feels native on iPhone and looks gorgeous in the browser.

**Live app:** https://all-is-well-zeta.vercel.app

---

## Why this exists

Students preparing for NEET, JEE, CUET, CAT, GATE, UPSC, and board exams deal with stress, burnout, comparison, and result anxiety. All Is Well is a simple, positive space to check in with yourself — no judgment, no toxic hustle culture.

> *"All is well, yaar."*

---

## Progressive Web App (iOS & mobile)

All Is Well is a **full PWA** — install it on your iPhone like a native app, no App Store needed.

### Install on iPhone (Safari)

1. Open https://all-is-well-zeta.vercel.app in **Safari**
2. Tap the **Share** button
3. Select **Add to Home Screen**
4. Tap **Add**

The app opens in standalone mode (no browser chrome), with your home-screen icon, offline breathing exercises, and the same calm UI.

### Install on Android (Chrome)

1. Open the app in Chrome
2. Tap the menu → **Install app** or **Add to Home screen**

### PWA features

- Standalone full-screen experience
- Home screen icon and splash-style launch
- Offline fallback for breathing exercises (`/offline` → `/breathe`)
- Service worker caching via `@ducanh2912/next-pwa`
- In-app install prompt on supported browsers

---

## Design

Mobile-first UI inspired by modern wellness apps — soft, warm, and easy on the eyes during late-night study sessions.

| Element | Detail |
|--------|--------|
| **Palette** | Lavender background (`#F0F4FF`), warm orange CTAs (`#FF8C42`), soft purple accents (`#7C6FCD`), calm teal highlights (`#4ECDC4`) |
| **Layout** | Rounded cards, generous whitespace, pill-shaped controls |
| **Navigation** | Floating bottom nav bar (Home, Journal, Insights, Breathe, Guru) |
| **Imagery** | Curated Unsplash nature photos keyed to your mood |
| **Browser** | Responsive max-width layout — looks polished on desktop too, not just a stretched phone view |
| **Motion** | Breathing circle animations, smooth check-in steps, mood emoji picker |

Open in any modern browser for the full experience. On desktop you get the same beautiful card-based layout centered in the viewport — clean, minimal, and intentionally calm.

---

## Features

| Feature | What it does |
|---------|----------------|
| **Daily Check-In** | Mood (1–10), energy & stress sliders, stress trigger chips, optional note |
| **Dashboard** | Streak counter, weekly mood sparkline, quote of the day, quick actions |
| **Journal** | AI-generated reflection prompts, before/after mood tracking |
| **Insights** | 7/30-day mood trends, trigger breakdown, AI weekly summary |
| **Breathe & Relax** | Box breathing, 4-7-8 technique, body scan, YouTube meditation & lo-fi |
| **Talk to Guru** | Hume EVI voice mentor — funny, chill, Hinglish Rancho energy |

---

## Tech stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Database:** MySQL (Aiven) + Kysely
- **Auth:** NextAuth v5 (Google OAuth + email/password)
- **AI:** OpenAI `gpt-5-mini` (journal prompts, insights)
- **Voice:** Hume AI EVI (`@humeai/voice-react`)
- **Media:** Unsplash + YouTube Data API
- **UI:** Tailwind CSS, Radix primitives, Recharts
- **PWA:** `@ducanh2912/next-pwa`
- **Deploy:** Vercel

---

## Local development

```bash
npm install
cp .env.example .env   # fill in your keys
npm run migrate
npm run dev
```

Open http://localhost:3000

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run migrate` | Run MySQL migrations |
| `npm run test:e2e` | API smoke tests (auth, check-in, insights, media) |

---

## Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Aiven MySQL connection string |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` or production domain) |
| `NEXTAUTH_SECRET` | Random secret for session signing |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `OPENAI_API_KEY_ONE` / `OPENAI_MODEL` | AI journal & insights |
| `UNSPLASH_API_KEY` | Dashboard wellness imagery |
| `YOUTUBE_API_KEY_ONE` (+ TWO/THREE) | Meditation & study music videos |
| `HUME_API_KEY` / `HUME_SECRET_KEY` | Voice mentor auth |
| `NEXT_PUBLIC_HUME_CONFIG_ID` | Hume EVI config ID (from [app.hume.ai/evi/configs](https://app.hume.ai/evi/configs)) |

---

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add all env vars (set `NEXTAUTH_URL` to your production domain)
4. Deploy

### Google OAuth (production)

Add to your Google Cloud OAuth client:

**Authorized JavaScript origins**
```
https://your-domain.vercel.app
```

**Authorized redirect URIs**
```
https://your-domain.vercel.app/api/auth/callback/google
```

---

## Project structure

```
src/
├── app/(app)/          # Main app pages (dashboard, check-in, journal, etc.)
├── app/(auth)/         # Login & register
├── app/api/            # REST API routes
├── components/         # UI, mood picker, guru voice, PWA install prompt
├── repositories/       # Kysely data access
├── services/           # Business logic
├── schemas/            # Zod validation
└── lib/                # Auth, database, OpenAI, Unsplash, YouTube
```

---

## License

Built for PromptWars — mental wellness during exam season. All is well.
