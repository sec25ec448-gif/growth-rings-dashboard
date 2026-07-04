import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          50: "#f1f5ee",
          100: "#dfe9d7",
          200: "#c0d3b1",
          300: "#9cb884",
          400: "#749a5f",
          500: "#3f6b4f",
          600: "#325944",
          700: "#284737",
          800: "#1f382b",
          900: "#152a1f",
          950: "#0c1a13",
        },
        clay: {
          100: "#efe2d2",
          200: "#dcc4a3",
          300: "#c39d72",
          400: "#a97c50",
          500: "#7a5c3e",
          600: "#634a32",
          700: "#4c3826",
        },
        gold: {
          100: "#faefd4",
          200: "#f2d89b",
          300: "#e6c06a",
          400: "#d9a441",
          500: "#b8842b",
        },
        parchment: "#eff1ea",
        ink: "#152018",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        ring: "0 1px 2px rgba(21,32,24,0.06), 0 8px 24px -8px rgba(21,32,24,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        grow: {
          "0%": { strokeDashoffset: "var(--ring-full)" },
          "100%": { strokeDashoffset: "var(--ring-offset)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        grow: "grow 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        fadeUp: "fadeUp 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
