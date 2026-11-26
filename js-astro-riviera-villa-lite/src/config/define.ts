import type { VillaInput } from './schema.ts';

/**
 * Gives `villa.config.ts` autocompletion and type checking in your editor.
 * The full validation (with readable error messages) runs at build time in `src/config/index.ts`.
 */
export function defineVilla(config: VillaInput): VillaInput {
  return config;
}
