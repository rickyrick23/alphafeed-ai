/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jup: {
          bg: "#13171f",       // Deep Space Background
          card: "#1c2128",     // Glass Card Color
          border: "#2d3748",   // Subtle Border
          lime: "#c7f284",     // Jupiter Neon Green
          text: "#e5e7eb",     // Soft White Text
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};