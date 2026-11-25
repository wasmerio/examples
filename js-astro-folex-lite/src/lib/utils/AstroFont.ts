import { fontProviders } from "astro/config";

/**
 * Generates Astro-compatible font configuration from custom font JSON
 * @param {Array} fontsJson - Array of font objects from fonts.json
 * @returns {Array} Astro-compatible font configuration array
 */
export function generateAstroFontsConfig(fontsJson: Array<any>): Array<any> {
  const fonts = fontsJson.map((font) => {
    // Extract weights and styles from src array
    const weights = [
      ...new Set(
        font.variants.map((variant: { weight: any }) => variant.weight),
      ),
    ];
    const styles = [
      ...new Set(font.variants.map((variant: { style: any }) => variant.style)),
    ];

    // Convert cssVariable to proper format (ensure it starts with --)
    const cssVariable = font.cssVariable.startsWith("--")
      ? font.cssVariable
      : `--${font.cssVariable}`;

    // Determine provider based on the provider field
    let provider;
    switch (font.provider) {
      case "google-fonts":
        provider = fontProviders.google();
        break;
      case "fontsource":
        provider = fontProviders.fontsource();
        break;
      case "bunny":
        provider = fontProviders.bunny();
        break;
      case "fontshare":
        provider = fontProviders.fontshare();
        break;
      // case 'adobe':
      //   provider = fontProviders.adobe();
      //   break;
      case "local":
        provider = "local";
        break;
      default:
        provider = fontProviders.google(); // Default to Google Fonts
    }

    // Base configuration
    const astroFont = {
      provider: provider,
      name: font.name,
      cssVariable: cssVariable,
      fallbacks: [font.fallback || "sans-serif"],
    };

    // if styles are defined, add them
    if (provider !== "local" && styles.length > 0) {
      // @ts-expect-error
      astroFont.styles = styles;
    }

    // If font.display is defined, use it
    if (font.display) {
      // @ts-expect-error
      astroFont.display = font.display;
    }

    // if weights are defined, add them
    if (provider !== "local" && weights.length > 0) {
      // @ts-expect-error
      astroFont.weights = weights;
    }

    // Add optimizedFallbacks if specified
    if (font.optimizedFallbacks !== undefined) {
      // @ts-expect-error
      astroFont.optimizedFallbacks = font.optimizedFallbacks;
    }

    // Add subsets if specified
    if (font.subsets) {
      // @ts-expect-error
      astroFont.subsets = font.subsets;
    }

    // If local hosted, add src
    if (font.provider === "local") {
      // @ts-expect-error
      astroFont.variants = font.variants;
    }

    return astroFont;
  });

  return fonts;
}
