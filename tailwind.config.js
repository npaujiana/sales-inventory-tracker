/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAFAF8',
          sidebar: '#1A1D23',
          sidebarHover: '#2A2E37',
          sidebarActive: '#262A33',
          text: '#1A1D23',
          muted: '#6B7280',
          border: '#E5E7EB',
          teal: '#0F6E56',
          tealHover: '#0B5442',
          tealLight: '#E8F5F1',
          red: '#B4231F',
          redLight: '#FDF2F2',
          amber: '#B45309',
          amberLight: '#FEF3C7',
          blue: '#1D4ED8',
          blueLight: '#EFF6FF',
          purple: '#6B21A8',
          purpleLight: '#F3E8FF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
