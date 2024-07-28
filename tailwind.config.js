/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#243c5a',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [
  ],
}
