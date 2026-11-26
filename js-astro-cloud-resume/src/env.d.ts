/// <reference types="astro/client" />

/** Build settings resolved in astro.config.mjs (brand, data file, demo links). */
declare module 'virtual:cloud-resume/build' {
  export const brand: import('./brands').Brand;
  /** Raw text of the resume data file. */
  export const dataRaw: string;
  /** Path of the data file, relative to the project root (for error messages). */
  export const dataFile: string;
  /** True only for the public demo build (DEMO_LINKS=true). */
  export const demoLinks: boolean;
}
