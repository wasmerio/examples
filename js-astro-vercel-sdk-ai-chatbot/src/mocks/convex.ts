/**
 * Mock helpers for wiring Convex.
 *
 * When ready, install `convex` and replace with real client code, e.g.:
 *   import { createClient } from "convex/browser";
 *   const convex = createClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
 *   await convex.mutation("messages:send", { ... })
 */

export type ConvexConfig = {
  url?: string;
  deployment?: string;
};

export function getConvexConfigFromEnv(): ConvexConfig {
  return {
    url:
      process.env.NEXT_PUBLIC_CONVEX_URL ||
      process.env.PUBLIC_CONVEX_URL ||
      process.env.CONVEX_URL,
    deployment: process.env.CONVEX_DEPLOYMENT,
  };
}

/**
 * Mock call helpers that mimic action/query signatures.
 */
export async function callConvexActionMock(actionPath: string, args: Record<string, unknown> = {}) {
  const cfg = getConvexConfigFromEnv();
  const hint = cfg.url ? `url=${cfg.url}` : cfg.deployment ? `deployment=${cfg.deployment}` : "no-config";
  return { ok: true, action: actionPath, args, using: hint } as const;
}

export async function callConvexQueryMock(queryPath: string, args: Record<string, unknown> = {}) {
  const cfg = getConvexConfigFromEnv();
  const hint = cfg.url ? `url=${cfg.url}` : cfg.deployment ? `deployment=${cfg.deployment}` : "no-config";
  return { ok: true, query: queryPath, args, using: hint } as const;
}

