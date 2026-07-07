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
        brand: {
          green: '#A3B81F',        // Primary green
          'green-light': '#b3c64c', // Lighter green (hover)
          'green-dark': '#829319',  // Darker green (active)
          orange: '#FF7700',        // Accent orange
          'orange-light': '#ff8f26', // Lighter orange
          'orange-dark': '#cc5f00',  // Darker orange
          gray: '#B7B7B7',          // Light gray
          'gray-dark': '#9C9C9C',   // Medium gray
        },
        // === Override indigo → Brand Green ===
        indigo: {
          300: '#b3c64c',   // light green (was light indigo)
          400: '#A3B81F',   // brand green
          500: '#A3B81F',   // brand green
          600: '#829319',   // dark green
          700: '#626e13',   // darker green
          // Keep transparent versions working:
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
