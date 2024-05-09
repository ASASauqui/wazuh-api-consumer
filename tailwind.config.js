/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ec4899',
          hover: '#f472b5'
        },
        strong: {
          DEFAULT: '#840444',
          hover: '#B8266F'
        },
      },
    },
  },
  plugins: [],
}
