#!/usr/bin/env node
/**
 * `pnpm test:no-emdash`
 *
 * Proves a Markdown build does not need `emdash`, `@emdash-cms/*` or `@astrojs/node`, and that the same guard
 * fails the EmDash source.
 */
import { runNoEmdash } from "@astronomic/theme-core/scripts/no-emdash.mjs";
import config from "./theme-tests.mjs";

await runNoEmdash(config);
