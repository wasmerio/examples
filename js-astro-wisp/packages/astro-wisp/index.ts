/**
 * astro-wisp —— 专注中文长文阅读的技术博客主题（Astro 集成）。
 *
 * ```ts
 * // astro.config.ts
 * import { defineConfig } from 'astro/config';
 * import wisp from 'astro-wisp';
 * export default defineConfig({ site: 'https://example.com', integrations: [wisp({ site: { title: 'My Blog' } })] });
 * ```
 */
export { default, OVERRIDABLE_COMPONENTS, OVERRIDABLE_LAYOUTS } from './src/integration';
export { defineWispConfig, wispConfigSchema } from './src/config';
export type { WispConfig, WispConfigInput, WispRuntime, WispRuntimeConfig } from './src/config';
export type { Palette, PaletteOverride } from './src/tokens/palette';
