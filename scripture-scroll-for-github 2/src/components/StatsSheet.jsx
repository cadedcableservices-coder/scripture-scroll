import { X } from "lucide-react";

export default function StatsSheet({ open, onClose, streak, versesReadToday, bookmarkCount }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl border-t border-gold-dim bg-ink-soft px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-5 animate-rise-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gold-dim" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-parchment">Today's reading</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-parchment/60" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Streak" value={streak} suffix="days" />
          <Stat label="Verses today" value={versesReadToday} />
          <Stat label="Saved" value={bookmarkCount} />
        </div>

        <p className="mt-6 text-center font-display text-sm italic text-parchment/60">
          "Your word is a lamp to my feet, and a light for my path."
        </p>

        <div className="mt-6 flex justify-center gap-4 text-[10px] uppercase tracking-widest text-parchment/30">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, suffix }) {
  return (
    <div className="rounded-2xl border border-gold-dim/60 bg-ink px-3 py-4 text-center">
      <div className="font-display text-2xl text-gold">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-parchment/50">
        {label} {suffix ? <span className="normal-case">{suffix}</span> : null}
      </div>
    </div>
  );
}
