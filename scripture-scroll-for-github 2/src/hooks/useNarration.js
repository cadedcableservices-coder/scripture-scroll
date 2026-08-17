import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps the browser's built-in speech synthesis so verse text can be read
 * aloud with zero setup and zero cost. Swap this out later for pre-generated
 * audio files (ElevenLabs, your own recordings, etc.) by changing only the
 * `speak` implementation — the rest of the app just awaits the promise.
 */
export function useNarration({ enabled = true, rate = 0.95 } = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const speak = useCallback(
    (text) => {
      if (!enabledRef.current || !("speechSynthesis" in window)) {
        return Promise.resolve();
      }
      window.speechSynthesis.cancel();
      return new Promise((resolve) => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = rate;
        utter.pitch = 1;
        utter.onstart = () => setIsSpeaking(true);
        const finish = () => {
          setIsSpeaking(false);
          resolve();
        };
        utter.onend = finish;
        utter.onerror = finish;
        window.speechSynthesis.speak(utter);
      });
    },
    [rate]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}
