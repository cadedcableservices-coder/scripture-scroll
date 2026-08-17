const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// High-energy / motion queries. Pexels is a stock library (no copyrighted
// game footage), so this targets the most kinetic, movement-heavy clips it
// actually has: FPV drone chases, downhill/skate/surf POV, city speed,
// light streaks, etc. Fills the "something moving fast behind the text" role.
const QUERIES = [
  "fpv drone racing",
  "downhill mountain bike pov",
  "first person parkour",
  "skateboarding pov",
  "surfing wave pov",
  "car driving fast night",
  "motorcycle ride pov",
  "snowboarding first person",
  "running through city",
  "neon light speed tunnel",
  "highway timelapse night",
  "waterfall drone flythrough"
];

// Local fallback clips — drop your own MP4s (recorded footage you own,
// downloaded Coverr/Pixabay clips) into /public/videos and list them here.
const LOCAL_FALLBACKS = [
  "/videos/fallback-1.mp4",
  "/videos/fallback-2.mp4",
  "/videos/fallback-3.mp4"
];

const cache = new Map();

export async function fetchRandomVideo() {
  if (!PEXELS_KEY) {
    return randomFrom(LOCAL_FALLBACKS);
  }

  const query = randomFrom(QUERIES);

  if (cache.has(query)) {
    return randomFrom(cache.get(query));
  }

  try {
    // per_page=30 for a bigger pool → more variety; portrait for full-bleed.
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(
        query
      )}&per_page=30&orientation=portrait&size=medium`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    if (!res.ok) throw new Error(`Pexels request failed: ${res.status}`);
    const data = await res.json();

    const links = (data.videos || [])
      .map((v) => {
        const files = v.video_files || [];
        // Prefer a true portrait HD file; fall back to any hd, then sd, then first.
        const portraitHd = files.find(
          (f) => f.height > f.width && (f.quality === "hd" || f.quality === "uhd")
        );
        const anyHd = files.find((f) => f.quality === "hd");
        const sd = files.find((f) => f.quality === "sd");
        return (portraitHd || anyHd || sd || files[0])?.link;
      })
      .filter(Boolean);

    if (links.length === 0) return randomFrom(LOCAL_FALLBACKS);

    cache.set(query, links);
    return randomFrom(links);
  } catch (err) {
    console.warn("Background video fetch failed, falling back to local clips:", err);
    return randomFrom(LOCAL_FALLBACKS);
  }
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
