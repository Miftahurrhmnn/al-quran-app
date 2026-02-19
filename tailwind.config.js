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
      }
    },
  },
  plugins: [],
}

