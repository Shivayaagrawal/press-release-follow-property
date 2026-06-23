import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gothic: ["var(--font-unifraktur)", "cursive"],
        playfair: ["var(--font-playfair)", "serif"],
        fell: ["var(--font-fell)", "serif"],
      },
      colors: {
        paper: {
          DEFAULT: "#ede4cc",
          card: "#e8ddc4",
          stack: "#d4c9a8",
        },
        ink: {
          DEFAULT: "#12100a",
          muted: "#5a4830",
          body: "#2a2010",
        },
        gold: "#c9a84c",
        terracotta: "#7a3515",
        forest: "#1e4a1e",
      },
    },
  },
  plugins: [],
};

export default config;
