#!/usr/bin/env node
/**
 * `pnpm test:parity [source ...]` (default: every source in theme-tests.mjs's SOURCES)
 *
 * Builds each source, runs conformance and the page checks, then compares every source against the first: the
 * model snapshots, and each page's status, title and text. EmDash reads a demo database seeded fresh from
 * seed/seed.json for the run (never ./data.db, which may hold older content).
 *
 * Both sources get the same real newsletter action. On the demo's placeholder a static build draws a demo form and a
 * production server draws "Follow by RSS" (src/utils/setup.ts), so in a copy with no demo-brand folder they would differ by
 * design. A real action is the same form in both, so the card is still compared.
 */
import { runParity } from "@astronomic/theme-core/scripts/parity.mjs";
import { freshFixtures } from "./lib/demo-db.mjs";
import config, { SOURCES } from "./theme-tests.mjs";

// Built as the demo in any copy: a production server leaves out what a static build keeps (placeholder links, src/utils/placeholders.ts), by design.
const demo = { ...config, hostedDemo: true };
process.env.VESPER_SETTINGS = JSON.stringify({ newsletterAction: "https://letters.vesper.test/rowan/subscribe" });

if (process.argv.length <= 2) process.argv.push(...SOURCES);
await runParity(process.argv.slice(2).some((s) => s !== "markdown") ? freshFixtures(demo) : demo);
