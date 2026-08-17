import { Flame } from "lucide-react";

/**
 * The app's signature visual element. A thin gold thread runs down the right
 * edge of the screen, standing in for the whole Bible (Genesis at the top,
 * Revelation at the bottom). A small flickering flame marks exactly how far
 * through you are — it's a candle-in-the-dark reading lamp, not a generic
 * progress bar.
 */
export default function ProgressThread({ progressPct, book }) {
  return (
    <div className="pointer-events-none absolute right-3 top-16 bottom-28 w-6 flex flex-col items-center">
      <div className="relative h-full w-px bg-gold-dim">
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
          style={{ top: `${progressPct}%` }}
        >
          <Flame className="h-4 w-4 text-gold animate-flicker -translate-y-1/2" strokeWidth={1.5} fill="rgba(201,164,76,0.35)" />
        </div>
      </div>
      <span className="mt-2 origin-top-right rotate-90 whitespace-nowrap text-[9px] tracking-[0.25em] text-gold/60 uppercase">
        {book}
      </span>
    </div>
  );
}
