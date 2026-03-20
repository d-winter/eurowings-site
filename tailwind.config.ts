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
    },
  },
  plugins: [],
};

export default config;
