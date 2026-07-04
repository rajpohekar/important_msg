/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#FFF7FB",
          100: "#FFF1F6",
          200: "#FFDDEA",
          300: "#FFBFD4",
          400: "#FF9DB9",
          500: "#F58FB1",
          600: "#D96C95",
        },
        lavender: {
          100: "#FCF7FF",
          200: "#F2EAFF",
          300: "#E9DFFF",
          400: "#D9C6FF",
        },
        peach: {
          200: "#FFE6DD",
          300: "#FFD6C9",
          400: "#FFC3AF",
        },
        cocoa: {
          600: "#7B5C6C",
          700: "#5B4351",
        },
      },
      boxShadow: {
        glass: "0 20px 60px rgba(245, 143, 177, 0.18)",
        glow: "0 18px 42px rgba(255, 157, 185, 0.42)",
        soft: "0 14px 36px rgba(91, 67, 81, 0.10)",
      },
      fontFamily: {
        rounded: [
          "Nunito",
          "Avenir Next",
          "ui-rounded",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
