/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    fontFamily: {},
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      backgroundImage: {},
      colors: {
        'accent-light': '#EAEAEA',
        'accent-mid': '#666666',
        'accent-dark': '#393939',
        'primary-white': '#FAFAFA',
        'primary-red': '#DD4D40',
        'primary-blue': '#3484F0',
        'primary-green': '#00DE31',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        cursor: {
          inspect:
            'url("https://res.cloudinary.com/nowo-ltd/image/upload/v1690434001/career%20hackers/inspect-icon_y2xvs0.png"), help',
          locked: 'url("/images/locked.cur.png"), not-allowed',
          'locked-white': 'url("/images/locked-white.cur.png"), not-allowed',
        },
      },
    },
  },
  plugins: [],
};
