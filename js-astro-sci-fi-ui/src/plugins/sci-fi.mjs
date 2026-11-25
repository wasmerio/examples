import plugin from "tailwindcss/plugin";

/**
 * Optional Tailwind plugin: sci-fi glow / HUD utilities mapped to design tokens.
 */
export default plugin(({ addUtilities }) => {
  addUtilities({
    ".sf-u-glow-outer": {
      "box-shadow":
        "0 0 0 1px color-mix(in oklab, var(--sf-color-primary) 35%, transparent), 0 0 28px var(--sf-glow-primary)",
    },
    ".sf-u-glow-inner": {
      "box-shadow": "inset 0 0 20px var(--sf-glow-primary)",
    },
    ".sf-u-label": {
      "font-family": "var(--font-sf-mono)",
      "letter-spacing": "0.22em",
      "text-transform": "uppercase",
      "font-size": "0.7rem",
      color: "var(--sf-text-muted)",
    },
    ".sf-u-data": {
      "font-family": "var(--font-sf-mono)",
      "letter-spacing": "0.08em",
      "font-variant-numeric": "tabular-nums",
    },
  });
});
