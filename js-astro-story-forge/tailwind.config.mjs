/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        paper: "#f7f4ee",
        ink: "#191714",
        accent: "#a44d2d",
        muted: "#6c6558",
      },
      fontFamily: {
        body: ["Noto Serif TC", "serif"],
        ui: ["Noto Sans TC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
