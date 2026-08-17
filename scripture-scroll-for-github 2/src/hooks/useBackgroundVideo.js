const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// Search terms tuned for calm, loopable, "oddly satisfying" ambient footage —
// legally reusable stock clips that fill the same role as the brainrot
// background videos, without touching anyone else's copyrighted footage.
const QUERIES = [
  "oddly satisfying",
  "kinetic sand cutting",
  "soap cutting asmr",
  "slow motion water",
  "abstract fluid paint",
  "calm ocean waves",
  "rain window slow motion",
  "candle flame close up"
];

// Local fallback clips — drop your own MP4s (recorded footage, downloaded
// Coverr/Pixabay clips, etc.) into /public/videos and list them here.
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
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(
        query
      )}&per_page=15&orientation=portrait`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    if (!res.ok) throw new Error(`Pexels request failed: ${res.status}`);
    const data = await res.json();
    const links = (data.videos || [])
      .map((v) => v.video_files.find((f) => f.quality === "sd") || v.video_files[0])
      .filter(Boolean)
      .map((f) => f.link);

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
