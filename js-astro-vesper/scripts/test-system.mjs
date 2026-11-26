#!/usr/bin/env node
/**
 * `pnpm test:system [source ...]` (default: every source in theme-tests.mjs's SOURCES)
 *
 * Checks the design system pages: off in a normal build, all four pages on with ASTRONOMIC_SYSTEM=1. EmDash reads a
 * demo database seeded fresh for the run.
 */
import { runSystem } from "@astronomic/theme-core/scripts/system.mjs";
import { freshFixtures } from "./lib/demo-db.mjs";
import config, { SOURCES } from "./theme-tests.mjs";

if (process.argv.length <= 2) process.argv.push(...SOURCES);
await runSystem(process.argv.slice(2).some((s) => s !== "markdown") ? freshFixtures(config) : config);
