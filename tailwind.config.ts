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
        primary: "#4F46E5",
        secondary: "#10B981",
        negative: "#EF4444",
        neutral: "#6B7280",
      },
    },
  },
  plugins: [],
};
export default config;
