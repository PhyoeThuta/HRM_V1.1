/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f8ec',
          100: '#ecf1d6',
          200: '#dae4aa',
          300: '#c6d579',
          400: '#b3c64c',
          500: '#A3B81F',
          600: '#829319',
          700: '#626e13',
          800: '#414a0c',
          900: '#212506',
          950: '#101203',
        },
        indigo: {
          50: '#f6f8ec',
          100: '#ecf1d6',
          200: '#dae4aa',
          300: '#c6d579',
          400: '#b3c64c',
          500: '#A3B81F',
          600: '#829319',
          700: '#626e13',
          800: '#414a0c',
          900: '#212506',
          950: '#101203',
        },
        accent: {
          50: '#fff5ed',
          100: '#ffebdb',
          200: '#ffd0b1',
          300: '#ffb484',
          400: '#ff9654',
          500: '#FF7700',
          600: '#cc5f00',
          700: '#994700',
          800: '#662f00',
          900: '#331800',
          950: '#1a0c00',
        },
        surface: {
          800: '#262626',
          850: '#1f1f1f',
          900: '#171717',
          950: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
