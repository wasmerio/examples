import { defineEcConfig } from "astro-expressive-code"
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers"
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections"

export default defineEcConfig({
  themes: ["monokai"],
  styleOverrides: {
    codeFontFamily: "Geist Mono Variable, monospace",
    uiFontFamily: "Geist Variable, sans-serif",
    borderColor: "transparent",
  },
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
  defaultProps: {
    // Disable line numbers by default
    showLineNumbers: false,

    // Change the default style of ExpressiveCode collapsible section plugin
    collapseStyle: "collapsible-auto",
  },
})
