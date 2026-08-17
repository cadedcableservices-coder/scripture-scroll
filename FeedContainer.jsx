import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import VerseCard from "./VerseCard";
import ProgressThread from "./ProgressThread";
import ActionRail from "./ActionRail";
import StreakBadge from "./StreakBadge";
import StatsSheet from "./StatsSheet";
import BrowseSheet from "./BrowseSheet";
import { useNarration } from "../hooks/useNarration";
import { useVerseFeed } from "../hooks/useVerseFeed";
import { fetchRandomVideo } from "../hooks/useBackgroundVideo";

const MIN_DWELL_MS = 6000; // never auto-advance faster than this, even if speech is silent/instant
const SWIPE_THRESHOLD_PX = 60; // minimum vertical drag to count as a swipe, not a tap

export default function FeedContainer() {
  const {
    currentVerse,
    currentRef,
    advance,
    goToIndex,
    skipForward,
    skipBack,
    sections,
    progressPct,
    streak,
    versesReadToday,
    isBookmarked,
    toggleBookmark,
    bookmarkCount
  } = useVerseFeed();

  const [started, setStarted] = useState(false);
  const [narrationOn, setNarrationOn] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const { speak, stop, unlock, supported } = useNarration();
  const narrationOnRef = useRef(narrationOn);
  narrationOnRef.current = narrationOn;
  const touchStartY = useRef(null);

  // Fetch a fresh background clip whenever the verse changes.
  useEffect(() => {
    let cancelled = false;
    fetchRandomVideo().then((url) => {
      if (!cancelled) setVideoUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [currentRef]);

  // The pacing loop. Only runs once the user has tapped "begin" (which also
  // unlocks audio). Each verse: read it aloud AND wait a minimum dwell, then
  // advance. Using Promise.all with a floor means a silent/instant speech
  // event can never cause runaway advancing — the min dwell always applies.
  // Manually swiping to a different verse also changes currentRef, which
  // restarts this effect for the newly-selected verse — swipe and auto-play
  // share the same pacing logic rather than fighting each other.
  useEffect(() => {
    if (!started) return;
    let cancelled = false;

    const minDelay = new Promise((r) => setTimeout(r, MIN_DWELL_MS));
    const speech = narrationOnRef.current && supported ? speak(currentVerse.text) : Promise.resolve();

    Promise.all([speech, minDelay]).then(() => {
      if (!cancelled) advance();
    });

    return () => {
      cancelled = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRef, started, narrationOn]);

  const handleBegin = useCallback(() => {
    unlock(); // must happen inside this user gesture
    setStarted(true);
  }, [unlock]);

  const handleShare = async () => {
    const shareText = `"${currentVerse.text}" — ${currentRef} (WEB)`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  // Swipe up → next verse, swipe down → previous verse. A short drag (under
  // the threshold) is treated as a tap and falls through to the double-tap
  // bookmark handler on VerseCard instead.
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    touchStartY.current = null;
    if (delta > SWIPE_THRESHOLD_PX) skipForward();
    else if (delta < -SWIPE_THRESHOLD_PX) skipBack();
  };

  // Desktop equivalent of swipe, for testing/mouse users.
  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) < 20) return;
    if (e.deltaY > 0) skipForward();
    else skipBack();
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <div
        className="no-scrollbar h-full w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <VerseCard
          verse={currentVerse}
          videoUrl={videoUrl}
          onDoubleTap={() => !isBookmarked && toggleBookmark(currentRef)}
        />
      </div>

      <StreakBadge streak={streak} onOpenStats={() => setStatsOpen(true)} />
      <ProgressThread progressPct={progressPct} book={currentVerse.book} />
      <ActionRail
        isBookmarked={isBookmarked}
        onToggleBookmark={() => toggleBookmark(currentRef)}
        narrationOn={narrationOn}
        onToggleNarration={() => setNarrationOn((v) => !v)}
        onShare={handleShare}
        onOpenBrowse={() => setBrowseOpen(true)}
      />
      <StatsSheet
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        streak={streak}
        versesReadToday={versesReadToday}
        bookmarkCount={bookmarkCount}
      />
      <BrowseSheet
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        sections={sections}
        onSelect={goToIndex}
      />

      {!started && (
        <button
          onClick={handleBegin}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-ink/70 backdrop-blur-sm"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gold-dim bg-ink-glass">
            <Play className="h-8 w-8 translate-x-0.5 text-gold" fill="#C9A44C" strokeWidth={0} />
          </span>
          <span className="mt-5 font-display text-xl text-parchment">Begin reading</span>
          <span className="mt-2 font-body text-xs uppercase tracking-[0.25em] text-parchment/50">
            {supported ? "Tap to start · swipe or read aloud" : "Tap to start · swipe to browse"}
          </span>
        </button>
      )}
    </div>
  );
}
