/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkBlue: "#0F172A",
        greenMain: "#227562",
      },
    },
  },
  plugins: [],
};
