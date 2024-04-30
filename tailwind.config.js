/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        current: '#a5f3fc',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        hover: 'var(--color-hover)',
        stroke: 'var(--color-stroke)',
        btn: 'var(--color-btn)',
        main: 'var(--color-main)',
        base: 'var(--color-base)'
      },
      fontFamily: {
        sans: 'Montserrat, Arial, sans-serif'
      }
    }
  },
  plugins: []
}
