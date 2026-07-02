/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#7c3aed',
        success: '#059669',
        warning: '#f59e0b',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
}
