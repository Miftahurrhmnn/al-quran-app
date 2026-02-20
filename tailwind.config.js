/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
      primary: '#0B1F2A',
      secondary: '#123B3B',
      accent: '#1B4D4D',
      gold: '#C9A227',
      cream: '#F5F1E8'
    },
    fontFamily: {
        arabic: ['"Amiri"', 'serif']
     },
    keyframes: {
      slideUp: {
        "0%": { transform: "translateY(100%)", opacity: 0 },
        "100%": { transform: "translateY(0)", opacity: 1 },
      },
    fadeIn: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
    },
    animation: {
      slideUp: "slideUp 0.35s ease-out forwards",
      fadeIn: "fadeIn 0.3s ease-out forwards",
    },
    },
  },
  plugins: [],
}

