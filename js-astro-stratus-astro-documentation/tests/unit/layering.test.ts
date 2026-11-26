import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = resolve(fileURLToPath(new URL(".", import.meta.url)));

const read = (path: string) => readFileSync(resolve(__dirname, "../..", path), "utf8");

function layerValue(token: string): number {
  const layers = read("src/styles/variables/_layers.css");
  const match = layers.match(new RegExp(`${token}:\\s*(\\d+)`));

  expect(match, `${token} is not declared in variables/_layers.css`).toBeTruthy();

  return Number(match![1]);
}

function zIndexToken(source: string, selector: string): string {
  const block = source.slice(source.indexOf(selector));
  const match = block.match(/z-index:\s*var\((--layer-\d)\)/);

  expect(match, `${selector} does not set a z-index from a --layer-* token`).toBeTruthy();

  return match![1];
}

describe("documentation shell layering", () => {
  // A wrong order is invisible on desktop; on a phone the drawer slides under the header.
  it("stacks the drawer above its scrim, and the scrim above the topbar", () => {
    const topbar = read("src/components/navigation/docs-topbar/DocsTopbar.astro");
    const sidebar = read("src/components/navigation/docs-sidebar/DocsSidebar.astro");

    const topbarLayer = layerValue(zIndexToken(topbar, ".docs-topbar {"));
    const drawerLayer = layerValue(zIndexToken(sidebar, "@media (width < 1024px)"));
    const scrimLayer = layerValue(
      zIndexToken(sidebar, ".docs-nav-toggle:checked ~ .docs-nav-scrim")
    );

    expect(drawerLayer).toBeGreaterThan(scrimLayer);
    expect(scrimLayer).toBeGreaterThan(topbarLayer);
  });
});
