import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#FA6616",
        "primary-light": "#FFF5F0",
        secondary: "#00B493",
        negative: "#E81300",
        neutral: "#868B94",
        carrot: {
          50: "#FFF5F0",
          100: "#FFE2D2",
          200: "#FFD2B9",
          300: "#FFBC97",
          400: "#FF9E66",
          500: "#FF7E36",
          600: "#FA6616",
        },
        gray: {
          50: "#F7F8FA",
          100: "#F2F3F6",
          200: "#EAEBEE",
          300: "#DCDEE3",
          400: "#D1D3D8",
          500: "#ADB1BA",
          600: "#868B94",
          700: "#4D5159",
          900: "#212124",
        },
      },
    },
  },
  plugins: [],
};
export default config;
