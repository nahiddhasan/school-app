import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: "var(--font-poppins)",
        trio: "var(--font-trio)",
      },
      colors: {
        primary: {
          "50": "#ecfdf7",
          "100": "#d1faec",
          "200": "#a7f3da",
          "300": "#6ee7bf",
          "400": "#34d39e",
          "500": "#10b981",
          "600": "#059666",
          "700": "#047852",
          "800": "#065f42",
          "900": "#064e36",
          "950": "#022c1e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
