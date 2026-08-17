/**
 * Regenerates the complete World English Bible (public domain) into
 * src/data/web-bible.json as a flat array of { book, chapter, verse, text }.
 *
 * The project already ships with the full Bible pre-generated, so you don't
 * need to run this — it's here so you can re-fetch fresh source data anytime,
 * or adapt it for another public-domain translation (KJV, ASV, etc. all live
 * in the same repo).
 *
 * Source: bible-api.com's own docs ask that you NOT bulk-download the whole
 * Bible through their live per-verse endpoint (it's a hobby server) and point
 * instead to the underlying open data: github.com/seven1m/open-bibles. This
 * script pulls the WEB text from that repo in USFX format (a real-world XML
 * Bible format that uses self-closing milestone tags like <v id="16"/> rather
 * than paired <verse>...</verse> tags) and converts it locally.
 *
 * Run with: npm run fetch-bible
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const XML_URL =
  "https://raw.githubusercontent.com/seven1m/open-bibles/master/eng-web.usfx.xml";
const OUTPUT_PATH = path.join("public", "data", "web-bible.json");

const BOOK_NAMES = {
  GEN: "Genesis", EXO: "Exodus", LEV: "Leviticus", NUM: "Numbers", DEU: "Deuteronomy",
  JOS: "Joshua", JDG: "Judges", RUT: "Ruth", "1SA": "1 Samuel", "2SA": "2 Samuel",
  "1KI": "1 Kings", "2KI": "2 Kings", "1CH": "1 Chronicles", "2CH": "2 Chronicles", EZR: "Ezra",
  NEH: "Nehemiah", EST: "Esther", JOB: "Job", PSA: "Psalms", PRO: "Proverbs",
  ECC: "Ecclesiastes", SNG: "Song of Solomon", ISA: "Isaiah", JER: "Jeremiah", LAM: "Lamentations",
  EZK: "Ezekiel", DAN: "Daniel", HOS: "Hosea", JOL: "Joel", AMO: "Amos",
  OBA: "Obadiah", JON: "Jonah", MIC: "Micah", NAM: "Nahum", HAB: "Habakkuk",
  ZEP: "Zephaniah", HAG: "Haggai", ZEC: "Zechariah", MAL: "Malachi",
  MAT: "Matthew", MRK: "Mark", LUK: "Luke", JHN: "John", ACT: "Acts",
  ROM: "Romans", "1CO": "1 Corinthians", "2CO": "2 Corinthians", GAL: "Galatians", EPH: "Ephesians",
  PHP: "Philippians", COL: "Colossians", "1TH": "1 Thessalonians", "2TH": "2 Thessalonians",
  "1TI": "1 Timothy", "2TI": "2 Timothy", TIT: "Titus", PHM: "Philemon", HEB: "Hebrews",
  JAS: "James", "1PE": "1 Peter", "2PE": "2 Peter", "1JN": "1 John", "2JN": "2 John", "3JN": "3 John",
  JUD: "Jude", REV: "Revelation"
};
const BOOK_ORDER = Object.values(BOOK_NAMES);

async function main() {
  console.log(`Fetching WEB Bible source from ${XML_URL} ...`);
  const res = await fetch(XML_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch source XML: ${res.status} ${res.statusText}`);
  }
  let xml = await res.text();

  console.log("Stripping footnotes and cross-references...");
  xml = xml.replace(/<f[^>]*>[\s\S]*?<\/f>/g, "");
  xml = xml.replace(/<x[^>]*>[\s\S]*?<\/x>/g, "");

  console.log("Parsing verses...");
  const verses = parseUsfx(xml);

  if (verses.length < 30000) {
    console.warn(
      `Warning: only parsed ${verses.length} verses — expected ~31,000. The source format may have changed; inspect the XML if this looks wrong.`
    );
  }

  const orderIndex = new Map(BOOK_ORDER.map((b, i) => [b, i]));
  verses.sort((a, b) => {
    return (
      orderIndex.get(a.book) - orderIndex.get(b.book) ||
      a.chapter - b.chapter ||
      a.verse - b.verse
    );
  });

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(verses), "utf-8");
  console.log(`Wrote ${verses.length} verses to ${OUTPUT_PATH}`);
}

/**
 * USFX marks chapters/verses with self-closing milestone tags:
 *   <c id="1"/> ... <v id="1"/>text<ve/> <v id="2"/>text<ve/> ...
 * rather than paired <verse>...</verse> elements. We split on those
 * milestones directly instead of using a general XML parser.
 */
function parseUsfx(xml) {
  const verses = [];
  const bookSplits = xml.split(/<book id="([A-Za-z0-9]+)">/).slice(1);

  for (let i = 0; i < bookSplits.length; i += 2) {
    const bookId = bookSplits[i];
    const content = bookSplits[i + 1];
    const bookName = BOOK_NAMES[bookId];
    if (!bookName) continue; // skip front matter / non-canonical sections

    const chapterSplits = content.split(/<c id="(\d+)"\/>/).slice(1);
    for (let j = 0; j < chapterSplits.length; j += 2) {
      const chapter = parseInt(chapterSplits[j], 10);
      const chapterContent = chapterSplits[j + 1];

      const verseRe = /<v id="(\d+)"\/>([\s\S]*?)(?=<v id="\d+"\/>|<ve\/>|<c id="\d+"\/>|$)/g;
      let m;
      while ((m = verseRe.exec(chapterContent)) !== null) {
        const verse = parseInt(m[1], 10);
        const text = m[2]
          .replace(/<[^>]+>/g, "")
          .replace(/\s+/g, " ")
          .trim();
        if (text) verses.push({ book: bookName, chapter, verse, text });
      }
    }
  }

  return verses;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
