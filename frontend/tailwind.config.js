/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        tinCarDark: "#1e293b",
        tinCarOrange: "#d68d2e",
      }
    },
  },
  plugins: [],
}