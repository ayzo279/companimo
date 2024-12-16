/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'coral': '#FF784F',
      'mint': '#40D6A4',
      'black': '#282828',
      'white': '#FAFAFF',
      'fade': '#AFAFB2',
    },
    fontFamily: {
      'sans': ['"Nunito"','sans-serif']
    },
    extend: {
      boxShadow: {
        'card': '0 0 1vw rgba(0,0,0,0.25)'
      }
    },
  },
  plugins: [],
}

