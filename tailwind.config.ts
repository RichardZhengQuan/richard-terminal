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
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      colors: {
        terminal: {
          bg: "#020403",
          shell: "#07110f",
          line: "#12342f",
          green: "#49ff9a",
          cyan: "#37e7ff",
          dim: "#7fa49d",
        },
      },
      boxShadow: {
        terminal: "0 0 0 1px rgba(55, 231, 255, 0.2), 0 24px 90px rgba(0, 255, 170, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
