/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14532d", // Dark Jungle Green
        secondary: "#f59e0b", // Amber/Yellow accent
        background: "#fdfdfd", 
        surface: "rgba(255, 255, 255, 0.6)", 
      },
      fontFamily: {
        title: ["Bungee", "cursive"],
        body: ["Inter", "sans-serif"],
        slogan: ["Quicksand", "sans-serif"],
      },
      boxShadow: {
        'mobile': '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0,0,0,0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
    },
  },
  plugins: [],
}
