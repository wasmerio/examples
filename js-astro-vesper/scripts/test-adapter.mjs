#!/usr/bin/env node
/**
 * `pnpm test:adapter`
 *
 * Tests the selected content source: CONTENT_SOURCE if set, otherwise the one astro.config.mjs selects. Builds it
 * with the conformance route, serves it, and prints /_conformance.json problems and the page check problems. A
 * source other than Markdown reads a demo database seeded fresh for the run (the page checks expect the demo).
 */
import { runAdapter } from "@astronomic/theme-core/scripts/adapter.mjs";
import { freshFixtures } from "./lib/demo-db.mjs";
import config from "./theme-tests.mjs";

await runAdapter((process.env.CONTENT_SOURCE ?? "markdown") !== "markdown" ? freshFixtures(config) : config);
