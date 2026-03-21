import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ew: {
          primary: "#A1045A",
          "primary-dark": "#7A0344",
          "primary-light": "#C4176E",
          dark: "#1D1D1B",
          grey: "#6B7280",
          light: "#F4F4F5",
          accent: "#FFB800",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        ticker: "ticker 39s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
