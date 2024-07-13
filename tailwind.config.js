/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      theme: {
        screens: {
          'xs': '340px',
        }
      }
    },
  },
  plugins: [],
}

