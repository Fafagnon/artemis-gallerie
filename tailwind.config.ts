import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        wall: "var(--wall)",
        pl: "var(--pl)",
        tx: "var(--tx)",
        gr: "var(--gr)",
        or: "var(--or)",
        or2: "var(--or2)",
      },
      fontFamily: {
        archivo: ["var(--font-archivo)", "Archivo", "-apple-system", "sans-serif"],
        newsreader: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        artemis: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        mq: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        mq: "mq 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

