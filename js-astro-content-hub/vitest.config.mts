// Vitest configuration for the unit test suite.
//
// - The suite covers pure logic modules (i18n, docs nav, content tag/related
//   helpers, media, heading ids, remark link rewriting, and the content
//   validation rules). No Astro build / DOM is exercised here.
// - `vi.mock('astro:content')` gives the i18n fallback tests (getLocalizedPaths
//   / renderLocalizedPage) a stubbed content runtime.
// - Tests live under tests/ and are excluded from `astro check` (tsconfig
//   includes only src/**), so type errors in tests do not gate the build.
import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      // Match tsconfig paths so tests can import via the same alias as app code.
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    // Isolate each test file; no shared state leaks between suites.
    include: ['tests/**/*.test.{ts,mts,mjs}'],
    environment: 'node',
  },
});
