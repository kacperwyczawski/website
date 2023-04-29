/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "InterVariable",
                    "Inter",
                    ...defaultTheme.fontFamily.sans
                ],
                fancy: [
                    "SoraVariable",
                    "Sora",
                    "InterVariable",
                    "Inter",
                    ...defaultTheme.fontFamily.sans
                ],
                mono: [
                    "Fira CodeVariable",
                    "Fira Code",
                    ...defaultTheme.fontFamily.mono
                ]
            }
        }
    },
    plugins: []
};
