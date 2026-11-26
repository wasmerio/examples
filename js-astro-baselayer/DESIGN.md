---
version: "alpha"
name: "Vertex Holdings Platform"
description: "Vertex Holdings Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#437652"
  secondary: "#8DA696"
  tertiary: "#418282"
  neutral: "#142418"
  background: "#437652"
  surface: "#8DA696"
  text-primary: "#A1A1AA"
  text-secondary: "#F4F4F5"
  border: "#DCE5DF"
  accent: "#437652"
typography:
  display-lg:
    fontFamily: "Newsreader"
    fontSize: "48px"
    fontWeight: 300
    lineHeight: "48px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "22.75px"
spacing:
  base: "6px"
  sm: "6px"
  md: "8px"
  lg: "16px"
  xl: "24px"
  gap: "8px"
  card-padding: "40px"
  section-padding: "40px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Bounded
  - Framing: Open
  - Grid: Strong

## Colors

The color system uses dark mode with #437652 as the main accent and #142418 as the neutral foundation.

- **Primary (#437652):** Main accent and emphasis color.
- **Secondary (#8DA696):** Supporting accent for secondary emphasis.
- **Tertiary (#418282):** Reserved accent for supporting contrast moments.
- **Neutral (#142418):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #437652; Surface: #8DA696; Text Primary: #A1A1AA; Text Secondary: #F4F4F5; Border: #DCE5DF; Accent: #437652

- **Gradients:** bg-gradient-to-b from-white/[0.08] to-white/[0.01], bg-gradient-to-b from-[#161917] to-[#0a0c0b], bg-gradient-to-b from-white/[0.06] to-transparent

## Typography

Typography pairs Newsreader for display hierarchy with Inter for supporting content and interface copy.

- **Display (`display-lg`):** Newsreader, 48px, weight 300, line-height 48px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 14px, weight 300, line-height 22.75px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, bounded structural frame before changing ornament or component styling. Use 6px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / bounded composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Bounded
- **Base unit:** 6px
- **Scale:** 6px, 8px, 16px, 24px, 32px, 40px, 48px, 64px
- **Section padding:** 40px, 96px, 128px
- **Card padding:** 40px
- **Gaps:** 8px

## Elevation & Depth

Depth is communicated through elevated, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as elevated first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Elevated
- **Borders:** 0.63px #FFFFFF; 0.63px #DCE5DF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.12) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.5) 0px 15px 35px -5px; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.4) 0px 2px 15px 0px inset; rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.6) 0px 40px 80px -20px, rgba(0, 0, 0, 0.8) 0px 0px 0px 1px, rgba(255, 255, 255, 0.08) 0px 1px 0px 0px inset

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 6px padding and a 16px radius. Drive the shell with linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.01)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 12px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 12px, 16px, 32px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Component styling should inherit the shared button, icon, spacing, and surface rules instead of inventing one-off treatments. Favor a small family of repeatable patterns for actions, content containers, and fields.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 6px rhythm.
- Do reuse the Elevated surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 12px, 16px, 32px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected minimal motion intensity without a deliberate reason.

## Motion

Motion stays restrained and interface-led across text, layout, and scroll transitions. Easing favors ease.

**Motion Level:** minimal

**Easings:** ease

## WebGL

Reconstruct the graphics as a inset 3d accent using webgl, renderer, alpha, antialias, dpr clamp. The effect should read as retro-futurist, technical, and meditative: perspective grid field with green on black and sparse spacing. Build it from grid lines + depth fade so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** ThreeJS, WebGL

**Insights:**
  - **Scene:**
    - **Value:** Inset 3D accent
  - **Effect:**
    - **Value:** Perspective grid field
  - **Primitives:**
    - **Value:** Grid lines + depth fade
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** WebGL, Renderer, alpha, antialias, DPR clamp

**Techniques:** Perspective grid, Breathing pulse, Pointer parallax, Noise fields, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- Deep Inset Module -->
      <div class="w-full aspect-[4/5] md:aspect-square bg-[#8da696] rounded-xl relative overflow-hidden shadow-[inset_0_2px_15px_rgba(0,0,0,0.4)]">
          <canvas id="canvas-2" class="absolute inset-0 w-full h-full z-0 cursor-crosshair"></canvas>
          <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 pointer-events-none"></div>
      </div>
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      // --- ThreeJS WebGL Animations (Preserved exactly as requested) ---
      function initWebGLCanvas(canvasId, particleHex, type) {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return;

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
          camera.position.z = 2.2;
      …
      ```
  - **Renderer setup:**
    - **Language:** js
    - **Snippet:**
      ```
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 2.2;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      …
      ```
  - **Scene setup:**
    - **Language:** js
    - **Snippet:**
      ```
      function initWebGLCanvas(canvasId, particleHex, type) {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return;

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
          camera.position.z = 2.2;
      …
      ```

## ThreeJS

Reconstruct the Three.js layer as a inset 3d accent with layered spatial depth that feels retro-futurist, volumetric, and technical. Use alpha, antialias, dpr clamp renderer settings, perspective, ~50deg fov, sphere + custom buffer geometry geometry, pointsmaterial materials, and ambient + key + rim lighting. Motion should read as pointer-reactive scene drift, with poster frame + dom fallback.

**Id:** threejs

**Label:** ThreeJS

**Stack:** ThreeJS, WebGL

**Insights:**
  - **Scene:**
    - **Value:** Inset 3D accent with layered spatial depth
  - **Render:**
    - **Value:** alpha, antialias, DPR clamp
  - **Camera:**
    - **Value:** Perspective, ~50deg FOV
  - **Lighting:**
    - **Value:** ambient + key + rim
  - **Materials:**
    - **Value:** PointsMaterial
  - **Geometry:**
    - **Value:** sphere + custom buffer geometry
  - **Motion:**
    - **Value:** Pointer-reactive scene drift

**Techniques:** Particle depth, Timeline beats, alpha, antialias, DPR clamp, Poster frame + DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- Deep Inset Module -->
      <div class="w-full aspect-[4/5] md:aspect-square bg-[#8da696] rounded-xl relative overflow-hidden shadow-[inset_0_2px_15px_rgba(0,0,0,0.4)]">
          <canvas id="canvas-2" class="absolute inset-0 w-full h-full z-0 cursor-crosshair"></canvas>
          <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 pointer-events-none"></div>
      </div>
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      // --- ThreeJS WebGL Animations (Preserved exactly as requested) ---
      function initWebGLCanvas(canvasId, particleHex, type) {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return;

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
          camera.position.z = 2.2;
      …
      ```
  - **Renderer setup:**
    - **Language:** js
    - **Snippet:**
      ```
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 2.2;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      …
      ```
  - **Scene setup:**
    - **Language:** js
    - **Snippet:**
      ```
      function initWebGLCanvas(canvasId, particleHex, type) {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return;

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
          camera.position.z = 2.2;
      …
      ```
