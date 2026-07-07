/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          canvas: '#0b1224',
          card: '#131c35',
          mint: '#10b981',
        }
      }
    },
  },
  plugins: [],
}