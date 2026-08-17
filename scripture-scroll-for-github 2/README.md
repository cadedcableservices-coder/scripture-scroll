# Scripture Scroll

A personal, installable, TikTok-style vertical feed for reading the Bible one verse at a time — full-bleed looping ambient video, narration, streaks, bookmarks. Built with React + Vite + Tailwind as an installable PWA.

## Design

- **Palette:** ink navy background, warm parchment text, antique gold accent, a muted ember for likes
- **Type:** Fraunces (serif, verse text) + Inter (sans, UI chrome)
- **Signature element:** "the Wick" — a vertical gold thread on the right edge with a flickering flame marking your position from Genesis to Revelation, instead of a generic progress bar

## Quick start

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev
```

Open the printed local URL on your phone (same wifi network) to test it as a real mobile feed, or open it in a desktop browser's device-emulation mode.

## Bible text

The app ships with a small **real, working sample** (`src/data/web-bible-sample.json` — John 3 in full, plus Genesis 1:1-3) so it runs immediately with zero setup, all text from the public-domain World English Bible (WEB).

To get the **entire Bible** (~31,000 verses):

```bash
npm run fetch-bible
```

This pulls the full WEB text from the open-bibles GitHub archive and writes `public/data/web-bible.json`, which the app fetches at runtime (not bundled into the JS, so it doesn't bloat your initial load — and the service worker caches it for offline use). **This project already ships with the full Bible pre-generated**, so you don't need to run this unless you want to refresh it.

## Background video

By default the app uses your local fallback clips in `public/videos/`. For an endless variety of oddly-satisfying/ambient loops:

1. Get a free key at [pexels.com/api](https://www.pexels.com/api/)
2. Put it in `.env.local` as `VITE_PEXELS_API_KEY=...`
3. Restart `npm run dev`

You can also drop your own MP4s (recorded gameplay you own, downloaded Coverr/Pixabay clips) into `public/videos/` and list them in `src/hooks/useBackgroundVideo.js` under `LOCAL_FALLBACKS`.

## Narration

Uses the browser's built-in Web Speech API by default — free, zero setup, works offline. To upgrade to a more natural voice later, swap the implementation in `src/hooks/useNarration.js` for pre-generated audio files (ElevenLabs, OpenAI TTS, or your own recordings).

## Deploying

Any static host works — [Vercel](https://vercel.com) or [Netlify](https://netlify.com) both have generous free tiers and a `vercel.json`/`public/_redirects` file is already included so routes like `/terms` work correctly in production.

```bash
npm run build
```
Then connect your GitHub repo to Vercel/Netlify, or drag-and-drop the `dist/` folder if you just want it live quickly. Set your Pexels API key as an environment variable in the host's dashboard, not just locally.

**Running a private instance for yourself alongside the public one:** deploy the same code a second time as a separate project/domain, and use your host's real access control (Vercel password protection, Cloudflare Access) rather than trying to hide one shared URL — see `docs/COMPLIANCE_NOTES.md` for why.


1. Run `npm run build && npm run preview` (or deploy `dist/` anywhere — Vercel, Netlify, GitHub Pages all work free)
2. Open the URL on your phone
3. Share menu → **Add to Home Screen** (iOS) or the install prompt (Android/Chrome)

It'll launch full-screen with no browser chrome, just like a native app.

## Project structure

```
src/
├── data/
│   └── web-bible-sample.json   # bundled starter/fallback data (real WEB text)
├── hooks/
│   ├── useNarration.js         # Web Speech API wrapper
│   ├── useBackgroundVideo.js   # Pexels fetch + local fallback
│   └── useVerseFeed.js         # progress, streak, bookmarks (localStorage)
├── components/
│   ├── VerseCard.jsx           # full-bleed video + verse text + double-tap heart
│   ├── FeedContainer.jsx       # orchestrates narration/video/auto-advance
│   ├── ProgressThread.jsx      # signature gold "wick" progress element
│   ├── ActionRail.jsx          # bookmark / mute / share icons
│   ├── StreakBadge.jsx         # top-corner streak counter
│   └── StatsSheet.jsx          # bottom sheet with session stats
public/
└── data/
    └── web-bible.json          # full Bible (31,098 verses), fetched at runtime
scripts/
└── fetch-bible.mjs             # regenerates public/data/web-bible.json from source
```

## Legal pages

Minimal Terms of Service and Privacy Policy live at `/terms` and `/privacy` — linked from the stats sheet in the app. Fill in the `[DATE]` and `[YOUR CONTACT EMAIL]` placeholders before publishing. See `docs/COMPLIANCE_NOTES.md` for the full picture (it's short — no comments means very little to worry about).

## Roadmap ideas

- Topic/book filters ("Psalms only" mode)
- Swap video categories (calm vs. kinetic) as a settings toggle
- Pre-generated natural-voice narration for your favorite books
- Daily reminder notification via the service worker
