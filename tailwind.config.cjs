/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "Inter", ...defaultTheme.fontFamily.sans],
        fancy: [
          "Sora Variable",
          "Sora",
          ...defaultTheme.fontFamily.sans,
        ],
        mono: [
          "Fira Code Variable",
          "Fira Code",
          ...defaultTheme.fontFamily.mono,
        ],
      },
      colors: {
        slate: {
          850: "#172033",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
