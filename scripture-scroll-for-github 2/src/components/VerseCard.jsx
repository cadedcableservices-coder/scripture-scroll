import { useRef, useState } from "react";
import { Heart } from "lucide-react";

export default function VerseCard({ verse, videoUrl, scene, onDoubleTap }) {
  const [burst, setBurst] = useState(null);
  const lastTap = useRef(0);

  const handleTap = (e) => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX ?? e.changedTouches?.[0]?.clientX ?? rect.width / 2) - rect.left;
      const y = (e.clientY ?? e.changedTouches?.[0]?.clientY ?? rect.height / 2) - rect.top;
      setBurst({ x, y, id: now });
      onDoubleTap?.();
    }
    lastTap.current = now;
  };

  return (
    <div
      className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-ink"
      onClick={handleTap}
      onTouchEnd={handleTap}
    >
      {scene ? (
        scene
      ) : (
        videoUrl && (
          <video
            key={videoUrl}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      )}

      {/* darken/vignette so text always stays legible over any footage */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/20" />
      <div className="glass-panel absolute inset-x-0 bottom-0 h-[42%]" />

      {burst && (
        <Heart
          key={burst.id}
          className="pointer-events-none absolute h-20 w-20 text-ember animate-heart-pop"
          style={{ left: burst.x - 40, top: burst.y - 40 }}
          fill="#E2673B"
          strokeWidth={0}
        />
      )}

      <div className="absolute inset-x-6 bottom-[calc(env(safe-area-inset-bottom)+28px)] max-w-xl">
        <div className="hairline-gold mb-4 w-10" />
        <p className="font-display text-[1.7rem] leading-[1.35] text-parchment drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {verse.text}
        </p>
        <p className="mt-4 font-body text-xs uppercase tracking-[0.3em] text-gold">
          {verse.book} {verse.chapter}:{verse.verse}
          <span className="ml-2 text-parchment/40 tracking-normal normal-case">WEB</span>
        </p>
      </div>
    </div>
  );
}
