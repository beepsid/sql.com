/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          300: '#7c8cf7',
          400: '#60a5fa',
          500: '#667eea',
          600: '#5568d3',
          700: '#4c51bf',
          900: '#1e1b4b',
        }
      }
    },
  },
  plugins: [],
}
