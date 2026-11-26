import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import scrollbar from "tailwind-scrollbar";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "./astro.config.ts"],
  theme: {
    // Remove the following screen breakpoint or add other breakpoints
    // if one breakpoint is not enough for you
    screens: {
      sm: "640px",
    },
    extend: {
      colors: {
        skin: {
          fill: "rgb(var(--color-fill) / <alpha-value>)",
          base: "rgb(var(--color-text-base) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          card: "rgb(var(--color-card) / <alpha-value>)",
          muted: "rgb(var(--color-card-muted) / <alpha-value>)",
          border: "rgb(var(--color-border) / <alpha-value>)",
        }
      },
      textColor: {
        skin: {
          base: "rgb(var(--color-text-base) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          inverted: "rgb(var(--color-fill) / <alpha-value>)",
        },
      },
      backgroundColor: {
        skin: {
          fill: "rgb(var(--color-fill) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          inverted: "rgb(var(--color-text-base) / <alpha-value>)",
          card: "rgb(var(--color-card) / <alpha-value>)",
          muted: "rgb(var(--color-card-muted) / <alpha-value>)",
        },
      },
      outlineColor: {
        skin: {
          fill: "rgb(var(--color-accent) / <alpha-value>)",
        },
      },
      borderColor: {
        skin: {
          line: "rgb(var(--color-border) / <alpha-value>)",
          fill: "rgb(var(--color-text-base) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
        },
      },
      fill: {
        skin: {
          base: "rgb(var(--color-text-base) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
        },
        transparent: "transparent",
      },
      fontFamily: {
        skin: ["Noto Sans Mono", "Noto Color Emoji", ...fontFamily.mono],
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: false,
            },
            code: {
              color: false,
            },
          },
        },
      },
    },
  },
  plugins: [typography, scrollbar({ nocompatible: true })],
} satisfies Config;
