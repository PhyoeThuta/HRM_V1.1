/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Busy Boss Diet Brand Colors ===
        // These are pre-calculated so that after CSS invert+hue-rotate in Light Mode,
        // they show as the exact target colors: Green #A3B81F, Orange #FF7700
        brand: {
          green: '#CBE047',         // → #A3B81F after light mode filter
          'green-light': '#d4e85a', // lighter
          'green-dark': '#b8cc2e',  // darker
          orange: '#FF7700',        // → stays orange after filter  
          'orange-light': '#ff8f26',
          'orange-dark': '#cc5f00',
          gray: '#B7B7B7',
          'gray-dark': '#9C9C9C',
        },
        // === Override indigo → Pre-inverted BBD green ===
        indigo: {
          300: '#d4e85a',
          400: '#CBE047',
          500: '#CBE047',
          600: '#b8cc2e',
          700: '#9ab020',
        },
        // === Override emerald → Orange accent ===
        // (used in some stat cards)
        // Surface / Background scale (Dark Navy)
        surface: {
          800: '#1e2235',
          850: '#161929',
          900: '#0f1120',
          950: '#080b14',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
