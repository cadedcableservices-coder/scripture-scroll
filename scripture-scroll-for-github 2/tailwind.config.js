/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F1A",
        "ink-soft": "#151B2B",
        "ink-glass": "rgba(21, 27, 43, 0.72)",
        parchment: "#F3ECDA",
        gold: "#C9A44C",
        "gold-dim": "rgba(201, 164, 76, 0.35)",
        ember: "#E2673B"
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"]
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: 1, filter: "drop-shadow(0 0 6px rgba(201,164,76,0.9))" },
          "50%": { opacity: 0.75, filter: "drop-shadow(0 0 3px rgba(201,164,76,0.6))" }
        },
        "heart-pop": {
          "0%": { transform: "scale(0)", opacity: 0 },
          "30%": { transform: "scale(1.2)", opacity: 1 },
          "60%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)", opacity: 0 }
        },
        "rise-in": {
          "0%": { transform: "translateY(16px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      },
      animation: {
        flicker: "flicker 2.4s ease-in-out infinite",
        "heart-pop": "heart-pop 0.7s ease-out forwards",
        "rise-in": "rise-in 0.5s ease-out forwards"
      }
    }
  },
  plugins: []
};
