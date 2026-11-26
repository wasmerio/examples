/**
 * Theme settings. Resume content goes in `src/data/resume.yaml`.
 * The public URL (`site` / `base`) is set in `astro.config.mjs`.
 *
 * This file is also read by astro.config.mjs: keep it free of `astro:*` imports.
 */
import type { Brand } from './brands';
import type { Locale } from './i18n/ui';

export type SectionId = 'experiences' | 'projects' | 'certifications' | 'education';
export type SidebarId = 'skills' | 'languages' | 'interests';

export interface ThemeConfig {
  /**
   * Visual style: 'aws' | 'azure' | 'gcp' | 'openstack'.
   * Changes colours, font and console details only; the content is the same.
   * Defaults to 'aws'. The BRAND environment variable overrides it for one build.
   */
  brand?: Brand;
  /**
   * Resume data file (YAML), relative to the project root.
   * Examples for every brand are in `src/data/examples/`.
   * Defaults to 'src/data/resume.yaml'. The RESUME_DATA environment variable
   * overrides it for one build.
   */
  data?: string;
  /** Language of the interface labels and date formats ('en' | 'fr', see src/i18n/ui.ts). */
  lang: Locale;
  /** Theme used before the visitor picks one: follow the OS, or force light/dark. */
  defaultTheme: 'system' | 'light' | 'dark';
  /** Order of the main column. Remove an id to hide that section. */
  sections: SectionId[];
  /** Order of the side column. Remove an id to hide that section. */
  sidebar: SidebarId[];
  /**
   * "Download PDF" button. Put the file in `public/` (e.g. public/resume.pdf)
   * and set its path here, or an absolute URL. `null` hides the button.
   */
  pdf: string | null;
  /** Show a "Print" button (the print stylesheet produces a clean PDF from the browser). */
  printButton: boolean;
  /** Optional page description for search engines; defaults to the resume summary. */
  description?: string;
  /** Optional social preview image (1200x630) in `public/` or absolute URL. */
  ogImage?: string;
  /**
   * Privacy-friendly analytics. Disabled by default.
   * Adds one `<script defer src=... {...attributes}>` tag to every page, e.g.:
   *   Plausible:  { src: 'https://plausible.io/js/script.js', attributes: { 'data-domain': 'cv.example.com' } }
   *   Umami:      { src: 'https://cloud.umami.is/script.js', attributes: { 'data-website-id': '<id>' } }
   *   GoatCounter:{ src: '//gc.zgo.at/count.js', attributes: { 'data-goatcounter': 'https://<code>.goatcounter.com/count' } }
   */
  analytics: { src: string; attributes?: Record<string, string> } | null;
}

const config: ThemeConfig = {
  brand: 'aws',
  data: 'src/data/resume.yaml',
  lang: 'en',
  defaultTheme: 'system',
  sections: ['experiences', 'certifications', 'projects', 'education'],
  sidebar: ['skills', 'languages', 'interests'],
  pdf: null,
  printButton: true,
  analytics: null,
};

export default config;
