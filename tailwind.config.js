/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#ffffff',
          100: '#faf9f6',
          200: '#f3f1ec',
          300: '#e5e2dc',
          400: '#d4d0c8',
          800: '#292524',
          900: '#1c1917',
        },
      },
    },
  },
  plugins: [],
};
