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
          green: '#A3B81F',
          'green-light': '#b3c64c',
          'green-dark': '#829319',
          orange: '#FF7700',
          'orange-light': '#ff8f26',
          'orange-dark': '#cc5f00',
          gray: '#B7B7B7',
          'gray-dark': '#9C9C9C',
        },
        // === indigo → BBD Lime Green (for all existing indigo-xxx classes) ===
        indigo: {
          300: '#b3c64c',
          400: '#A3B81F',
          500: '#A3B81F',
          600: '#829319',
          700: '#626e13',
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
        burmese: ['Pyidaungsu', 'Myanmar Text', 'Padauk', 'Tharlon', 'Zawgyi-One', 'Inter', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.burmese').join(', '),
            lineHeight: '1.8',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            h1: {
              lineHeight: '1.4',
              color: theme('colors.brand.green'),
            },
            h2: {
              lineHeight: '1.4',
              marginTop: '1.75em',
              marginBottom: '0.75em',
              paddingBottom: '0.3em',
              borderBottomWidth: '1px',
              borderColor: theme('colors.gray.200'),
            },
            h3: {
              lineHeight: '1.4',
              color: theme('colors.gray.800'),
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            blockquote: {
              borderLeftColor: theme('colors.brand.orange'),
              backgroundColor: theme('colors.gray.50'),
              padding: '1em',
              fontStyle: 'normal',
              color: theme('colors.gray.700'),
              borderRadius: '0.375rem',
            }
          }
        },
        invert: {
          css: {
            h2: {
              borderColor: theme('colors.gray.700'),
            },
            h3: {
              color: theme('colors.gray.200'),
            },
            blockquote: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.300'),
            }
          }
        }
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
