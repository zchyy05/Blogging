/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'akane': "url('./src/assets/akane.jpg')"
      }
    },
  },
  plugins: [],
}