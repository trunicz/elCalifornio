/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        stroke: 'var(--color-stroke)',
        btn: 'var(--color-btn)',
        main: 'var(--color-main)'
      }
    }
  },
  plugins: []
}
