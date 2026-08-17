import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps the browser's built-in speech synthesis so verse text can be read
 * aloud. Browsers block speech until the user interacts with the page at
 * least once, so callers must invoke `unlock()` from inside a real click/tap
 * handler before the first `speak()` — see the tap-to-begin overlay.
 */
export function useNarration({ rate = 0.9 } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);
  const voiceRef = useRef(null);

  // Pick a decent English voice once they're loaded.
  useEffect(() => {
    if (!supported) return;
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((v) => /en[-_]US/i.test(v.lang) && /natural|google|samantha|female/i.test(v.name)) ||
        voices.find((v) => /^en/i.test(v.lang)) ||
        voices[0] ||
        null;
    };
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  // Must be called from within a user gesture to satisfy autoplay policies.
  const unlock = useCallback(() => {
    if (!supported) return;
    const u = new SpeechSynthesisUtterance("");
    window.speechSynthesis.speak(u);
    window.speechSynthesis.cancel();
  }, [supported]);

  const speak = useCallback(
    (text) => {
      if (!supported) return Promise.resolve();
      window.speechSynthesis.cancel();
      return new Promise((resolve) => {
        const utter = new SpeechSynthesisUtterance(text);
        if (voiceRef.current) utter.voice = voiceRef.current;
        utter.rate = rate;
        utter.pitch = 1;
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          setIsSpeaking(false);
          resolve();
        };
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = finish;
        utter.onerror = finish;
        window.speechSynthesis.speak(utter);
      });
    },
    [rate, supported]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);

  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return { speak, stop, unlock, isSpeaking, supported };
}
