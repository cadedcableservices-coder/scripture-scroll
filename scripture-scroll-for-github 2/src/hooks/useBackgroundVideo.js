const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// Contextual queries, matched to what's actually happening in the story —
// not generic action footage. Book-level sets a baseline mood/setting;
// chapter-level overrides hit specific iconic moments precisely.
const BOOK_QUERIES = {
  Genesis: ["desert dunes aerial", "starry night sky", "storm clouds timelapse", "ocean waves aerial"],
  Exodus: ["desert sand dunes", "sandstorm desert", "middle east desert mountains"],
  Joshua: ["ancient stone ruins", "desert mountains sunset"],
  Judges: ["ancient stone ruins", "desert mountains", "torchlight fire night"],
  Ruth: ["wheat field golden hour", "countryside harvest sunset"],
  "1 Samuel": ["desert mountains", "ancient stone ruins", "torchlight fire night"],
  "2 Samuel": ["ancient palace ruins", "desert mountains sunset"],
  "1 Kings": ["ancient temple ruins", "candlelight interior", "desert mountains"],
  "2 Kings": ["ancient ruins fire", "desert mountains storm"],
  Esther: ["ornate palace architecture", "candlelight silk fabric"],
  Daniel: ["fire flames close up", "lion close up", "ancient babylon ruins"],
  Jonah: ["stormy ocean waves", "ship sailing storm", "whale ocean underwater"],
  Luke: ["olive trees countryside", "sunrise over hills", "candlelight interior", "starry night bethlehem"],
  Acts: ["mediterranean sea aerial", "ancient roman ruins", "storm at sea", "sailing ship ocean"],
  Revelation: ["galaxy stars space", "golden light rays clouds", "aurora borealis", "cosmic nebula space"]
};

// Specific iconic chapters get their own precise moment instead of the
// book-level baseline.
const CHAPTER_QUERIES = {
  "Exodus|14": ["ocean waves parting", "stormy sea aerial"],
  "Daniel|3": ["fire flames close up", "furnace fire"],
  "Daniel|6": ["lion close up", "lion night"],
  "Luke|2": ["starry night sky", "candlelight night"],
  "Luke|24": ["sunrise over hills", "golden light dawn"],
  "Acts|2": ["fire flames close up", "wind through trees"],
  "Acts|27": ["storm at sea", "ship sailing storm"],
  "Revelation|21": ["golden light rays clouds", "aurora borealis"]
};

// Local fallback clips — drop your own MP4s (recorded footage you own,
// downloaded Coverr/Pixabay clips) into /public/videos and list them here.
const LOCAL_FALLBACKS = ["/videos/fallback-1.mp4", "/videos/fallback-2.mp4", "/videos/fallback-3.mp4"];

const cache = new Map();

export async function fetchRandomVideo(book, chapter) {
  if (!PEXELS_KEY) {
    return randomFrom(LOCAL_FALLBACKS);
  }

  const chapterSet = CHAPTER_QUERIES[`${book}|${chapter}`];
  const bookSet = BOOK_QUERIES[book];
  const queries = chapterSet || bookSet || Object.values(BOOK_QUERIES).flat();
  const query = randomFrom(queries);

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
