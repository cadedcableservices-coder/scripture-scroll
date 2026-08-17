import { useEffect, useRef, useState } from "react";
import VerseCard from "./VerseCard";
import ProgressThread from "./ProgressThread";
import ActionRail from "./ActionRail";
import StreakBadge from "./StreakBadge";
import StatsSheet from "./StatsSheet";
import { useNarration } from "../hooks/useNarration";
import { useVerseFeed } from "../hooks/useVerseFeed";
import { fetchRandomVideo } from "../hooks/useBackgroundVideo";

const DWELL_MS = 8000; // fallback auto-advance time when narration is off

export default function FeedContainer() {
  const {
    currentVerse,
    currentRef,
    advance,
    progressPct,
    streak,
    versesReadToday,
    isBookmarked,
    toggleBookmark,
    bookmarkCount
  } = useVerseFeed();

  const [narrationOn, setNarrationOn] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const { speak, stop } = useNarration({ enabled: narrationOn });
  const dwellTimer = useRef(null);

  // Fetch a fresh background clip whenever the verse changes
  useEffect(() => {
    let cancelled = false;
    fetchRandomVideo().then((url) => {
      if (!cancelled) setVideoUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [currentRef]);

  // Narrate (or dwell) then auto-advance to the next verse
  useEffect(() => {
    clearTimeout(dwellTimer.current);

    if (narrationOn) {
      speak(currentVerse.text).then(() => advance());
    } else {
      dwellTimer.current = setTimeout(advance, DWELL_MS);
    }

    return () => {
      stop();
      clearTimeout(dwellTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRef, narrationOn]);

  const handleShare = async () => {
    const shareText = `"${currentVerse.text}" — ${currentRef} (WEB)`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        /* user cancelled share sheet — no-op */
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <div className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll">
        <VerseCard verse={currentVerse} videoUrl={videoUrl} onDoubleTap={() => !isBookmarked && toggleBookmark(currentRef)} />
      </div>

      <StreakBadge streak={streak} onOpenStats={() => setStatsOpen(true)} />
      <ProgressThread progressPct={progressPct} book={currentVerse.book} />
      <ActionRail
        isBookmarked={isBookmarked}
        onToggleBookmark={() => toggleBookmark(currentRef)}
        narrationOn={narrationOn}
        onToggleNarration={() => setNarrationOn((v) => !v)}
        onShare={handleShare}
      />
      <StatsSheet
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        streak={streak}
        versesReadToday={versesReadToday}
        bookmarkCount={bookmarkCount}
      />
    </div>
  );
}
