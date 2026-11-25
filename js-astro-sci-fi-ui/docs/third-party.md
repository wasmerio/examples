# Third-party services and assets

This template touches several external networks. Use this page when you fork the project for production or redistribution.

## OpenStreetMap raster tiles

The tactical map can use **OpenStreetMap**-served raster tiles. Public tile endpoints have a [tile usage policy](https://operations.osmfoundation.org/policies/tiles/). Heavy or commercial traffic should use a **dedicated tile provider** or self-hosted tiles.

## Carto, OpenTopoMap, and other basemaps

Additional presets may pull tiles from **Carto**, **OpenTopoMap**, or similar. Each provider has its own terms, attribution requirements, and rate limits. Keep attributions visible (MapLibre attribution control) and comply with each provider’s rules.

## YouTube embeds

The `/intel` route embeds YouTube for a **decorative / layout** demo. YouTube’s terms apply to the embed. **Cross-origin restrictions** mean page JavaScript cannot read pixels from the iframe; any “analysis” UI that targets that stream would require a separate pipeline (not in this template).

## TensorFlow.js and COCO-SSD

When enabled (`PUBLIC_FEATURE_INTEL_ML` not set to `false`), the intel page loads **TensorFlow.js** and the **COCO-SSD** model. Weights and runtime assets are fetched from **Google’s CDNs** on first use. Inference runs **in the browser**; video from webcam or user-selected files is not uploaded by this demo. Review [TensorFlow.js](https://www.tensorflow.org/js) licensing and privacy implications for your product.

## Google Fonts

`ScifiLayout.astro` loads **Orbitron** and **Share Tech Mono** from Google Fonts. For stricter privacy, self-host fonts or switch to system stacks and remove the `<link>` tags.

## Weather API (demo charts)

The dashboard charts may request **Open-Meteo** (see `src/pages/api/` and chart code). Confirm their terms for your use case.
