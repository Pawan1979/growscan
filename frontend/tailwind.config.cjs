/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          blinkit:    '#f7c72c',
          zepto:      '#8224e3',
          instamart:  '#fc8019',
          bigbasket:  '#84c225',
          jiomart:    '#008ecc',
        },
      },
      boxShadow: {
        glass:   '0 4px 20px rgba(0,0,0,0.3)',
        float:   '0 12px 35px rgba(0,0,0,0.5)',
        glow:    '0 0 25px rgba(99,102,241,0.35)',
      },
    },
  },
  plugins: [],
};
