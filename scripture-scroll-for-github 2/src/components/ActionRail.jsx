import { Bookmark, Volume2, VolumeX, Share2 } from "lucide-react";

export default function ActionRail({ isBookmarked, onToggleBookmark, narrationOn, onToggleNarration, onShare }) {
  return (
    <div className="absolute right-3 bottom-40 flex flex-col items-center gap-6 z-20">
      <RailButton onClick={onToggleBookmark} active={isBookmarked} label="Save">
        <Bookmark
          className="h-6 w-6"
          strokeWidth={1.5}
          color={isBookmarked ? "#C9A44C" : "#F3ECDA"}
          fill={isBookmarked ? "#C9A44C" : "none"}
        />
      </RailButton>

      <RailButton onClick={onToggleNarration} active={narrationOn} label={narrationOn ? "Sound on" : "Muted"}>
        {narrationOn ? (
          <Volume2 className="h-6 w-6" strokeWidth={1.5} color="#F3ECDA" />
        ) : (
          <VolumeX className="h-6 w-6" strokeWidth={1.5} color="#F3ECDA" />
        )}
      </RailButton>

      <RailButton onClick={onShare} label="Share">
        <Share2 className="h-6 w-6" strokeWidth={1.5} color="#F3ECDA" />
      </RailButton>
    </div>
  );
}

function RailButton({ children, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1 transition-transform active:scale-90"
    >
      <span className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">{children}</span>
    </button>
  );
}
