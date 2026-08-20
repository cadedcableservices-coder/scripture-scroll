/**
 * Fully original, hand-coded animated scene — plain SVG shapes driven by CSS
 * keyframes. No external art, no AI generation, nothing modeled on anyone
 * else's animation. Loops indefinitely as a background, same slot a Pexels
 * video would occupy.
 *
 * Beat: David winds up the sling, releases the stone, it flies across the
 * screen, Goliath is struck and falls. Then a pause, then it resets and
 * loops.
 */
export default function DavidGoliathScene() {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-ink">
      <style>{`
        .dg-david-arm {
          transform-origin: 130px 405px;
          animation: dg-windup 8s ease-in-out infinite;
        }
        @keyframes dg-windup {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(360deg); }
          24% { transform: rotate(360deg); }
          28% { transform: rotate(300deg); }
          100% { transform: rotate(300deg); }
        }

        .dg-stone {
          offset-path: path('M 150 320 Q 260 220 340 232');
          animation: dg-throw 8s ease-in infinite;
          opacity: 0;
        }
        @keyframes dg-throw {
          0%, 22% { opacity: 0; offset-distance: 0%; }
          24% { opacity: 1; offset-distance: 0%; }
          32% { opacity: 1; offset-distance: 100%; }
          33%, 100% { opacity: 0; offset-distance: 100%; }
        }

        .dg-goliath {
          transform-origin: 340px 420px;
          animation: dg-fall 8s ease-in infinite;
        }
        @keyframes dg-fall {
          0%, 32% { transform: rotate(0deg) translateY(0); }
          42% { transform: rotate(-78deg) translateY(10px); }
          95% { transform: rotate(-78deg) translateY(10px); }
          100% { transform: rotate(0deg) translateY(0); }
        }

        .dg-dust {
          animation: dg-dust-puff 8s ease-out infinite;
        }
        @keyframes dg-dust-puff {
          0%, 40% { opacity: 0; r: 2; }
          44% { opacity: 0.6; r: 18; }
          55%, 100% { opacity: 0; r: 30; }
        }
      `}</style>
      <svg
        className="h-full w-full"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="dg-sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1b3d" />
            <stop offset="100%" stopColor="#0B0F1A" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="400" height="800" fill="url(#dg-sky-grad)" />
        <path d="M0 470 Q 100 440 200 465 T 400 460 L 400 800 L 0 800 Z" fill="#1a1230" opacity="0.7" />
        <rect x="0" y="490" width="400" height="310" fill="#141024" />
        <line x1="0" y1="490" x2="400" y2="490" stroke="#C9A44C" strokeOpacity="0.25" strokeWidth="1.5" />

        <circle className="dg-dust" cx="340" cy="480" r="2" fill="#C9A44C" opacity="0" />

        {/* David — small figure, left side, sling raised */}
        <g stroke="#F3ECDA" strokeWidth="4" strokeLinecap="round" fill="none">
          <circle cx="130" cy="380" r="14" fill="#F3ECDA" stroke="none" />
          <line x1="130" y1="394" x2="130" y2="450" />
          <line x1="130" y1="450" x2="112" y2="490" />
          <line x1="130" y1="450" x2="148" y2="490" />
          <line x1="130" y1="410" x2="105" y2="425" />
          <g className="dg-david-arm">
            <line x1="130" y1="410" x2="150" y2="390" />
            <line x1="150" y1="390" x2="150" y2="320" stroke="#C9A44C" strokeWidth="2" />
            <circle cx="150" cy="320" r="16" fill="none" stroke="#C9A44C" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="2 5" />
            <circle className="dg-stone" cx="150" cy="320" r="7" fill="#C9A44C" stroke="none" />
          </g>
        </g>

        {/* Goliath — tall figure, right side, spear raised */}
        <g className="dg-goliath" strokeLinecap="round" fill="none">
          <g stroke="#F3ECDA" strokeWidth="6">
            <polygon points="340,190 320,218 360,218" fill="#F3ECDA" stroke="none" />
            <circle cx="340" cy="232" r="18" fill="#F3ECDA" stroke="none" />
            <line x1="340" y1="250" x2="340" y2="360" />
            <line x1="340" y1="360" x2="313" y2="420" />
            <line x1="340" y1="360" x2="367" y2="420" />
            <line x1="340" y1="280" x2="365" y2="315" />
            <line x1="340" y1="280" x2="290" y2="245" />
          </g>
          <line x1="290" y1="245" x2="255" y2="145" stroke="#C9A44C" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}
