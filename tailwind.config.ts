import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burdah: {
          50: "#eef2fb",
          100: "#dbe4f6",
          200: "#b3c6ec",
          300: "#84a2de",
          400: "#5779cc",
          500: "#3956b0",
          600: "#28408f",
          700: "#1f3272",
          800: "#18275a",
          900: "#111d42",
          950: "#0a1230",
        },
        gold: {
          50: "#fdf8ec",
          100: "#f9ecc7",
          200: "#f2d788",
          300: "#e8bd52",
          400: "#d9a52f",
          500: "#c08920",
          600: "#9b6b1a",
          700: "#7b551b",
          800: "#65461d",
          900: "#563b1d",
        },
        sand: {
          50: "#fbf7f0",
          100: "#f5ecdc",
          200: "#ecdcbf",
          300: "#ddc194",
          400: "#cba36c",
          500: "#b7874e",
          600: "#976c3d",
          700: "#795633",
          800: "#63472e",
          900: "#523a28",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
      backgroundImage: {
        "geometric-pattern":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
