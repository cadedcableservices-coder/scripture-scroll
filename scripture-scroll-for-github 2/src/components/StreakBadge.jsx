import { Flame } from "lucide-react";

export default function StreakBadge({ streak, onOpenStats }) {
  return (
    <button
      onClick={onOpenStats}
      className="absolute left-4 top-[calc(env(safe-area-inset-top)+12px)] z-20 flex items-center gap-1.5 rounded-full border border-gold-dim bg-ink-glass px-3 py-1.5 backdrop-blur-sm"
    >
      <Flame className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} fill="rgba(201,164,76,0.4)" />
      <span className="font-body text-xs font-semibold tracking-wide text-parchment">{streak}</span>
      <span className="font-body text-[10px] uppercase tracking-widest text-parchment/50">day streak</span>
    </button>
  );
}
