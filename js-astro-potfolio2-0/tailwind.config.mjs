/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import scrollbar from "tailwind-scrollbar";
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        'nvim-bg': '#1c1c1c',
        'nvim-fg': '#d0d0d0',
        'nvim-gray': '#4e4e4e',
        'blue': '#5fafd7',
        'green': '#87d787',
        'nvim-statusline': '#303030',
        skin: {
          hue: withOpacity("--color"),
          muted: withOpacity("--muted"),
        },
        nvim: {
          blue: withOpacity("--color-nvim-blue"),
          green: withOpacity("--color-nvim-green"),
        }
      },
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          muted: withOpacity("--color-text-muted"),
          inverted: withOpacity("--color-text-inverted"),
        },
        nvim: {
          green: withOpacity("--color-nvim-green"),
          blue: withOpacity("--color-nvim-blue"),
        }
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("--color-fill"),
          "button-accent": withOpacity("--color-button-accent"),
          "button-accent-hover": withOpacity("--color-button-accent-hover"),
          "button-muted": withOpacity("--color-button-muted"),
        },
      },
      ringColor: {
        skin: {
          fill: withOpacity("--color-fill"),
        },
      },
      gradientColorStops: {
        skin: {
          hue: withOpacity("--color-fill"),
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    daisyui,
    scrollbar,
    require('tailwind-scrollbar-hide'),
  ],
};