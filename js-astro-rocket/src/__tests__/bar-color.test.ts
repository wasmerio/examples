/**
 * Holds the home page's toolbar colour to one value in the two places that
 * carry it.
 *
 * Safari on iOS floats a translucent toolbar over the foot of the screen and
 * tints it from the BODY's background. The home page's hero is a dark gradient
 * in both colour modes, so in light mode the body underneath is white and a
 * white strip was drawn across the foot of the hero.
 *
 * Two copies, because each is read by something that cannot see the other:
 *
 *   1. `data-bar-color` on the hero, whose VALUE the theme script paints onto
 *      the body while the hero covers the bottom edge of the screen. Read with
 *      getAttribute rather than out of the cascade, which is not reliable for a
 *      custom property on iOS Safari.
 *   2. `--bar-color` in the stylesheet, which ends the hero's gradient. This is
 *      the one the other is meant to match: the toolbar is right when it
 *      carries the colour the hero actually finishes on.
 *
 * `theme-color` is not one of them — that tag does not reach this surface.
 *
 * Nothing else ties these two together, so this does.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

const HOME = 'src/components/pages/views/HomeView.astro';
const LAYOUT = 'src/layouts/BaseLayout.astro';
const GLOBAL_CSS = 'src/styles/global.css';

/** The gradient's end stop, which the attribute is a copy of. */
function stylesheetValue(): string {
  const css = read(GLOBAL_CSS);
  const block = css.match(/(?<!\.dark )\.hero-dark-gradient\s*\{([^}]*)\}/);
  expect(block, `${GLOBAL_CSS} declares .hero-dark-gradient`).not.toBeNull();

  const found = block![1].match(/--bar-color\s*:\s*([^;]+);/);
  expect(found, '.hero-dark-gradient declares --bar-color').not.toBeNull();

  return found![1].trim();
}

describe('home page toolbar colour', () => {
  it('both hero gradients end on the named stop', () => {
    // Guards the premise rather than the copies: if the hero stopped ending on
    // this colour, the two values would agree with each other and disagree
    // with the page. Both rules matter — one is the dark-mode override.
    const css = read(GLOBAL_CSS);
    const rules = css.match(/\.hero-dark-gradient\s*\{[^}]*background:\s*linear-gradient\([^;]*;/g);
    expect(rules, 'the hero declares a gradient background').not.toBeNull();
    expect(rules!.length).toBe(2);
    for (const rule of rules!) {
      expect(rule).toMatch(/var\(--bar-color\)\s*100%/);
    }
  });

  it('the hero attribute carries the same value', () => {
    const found = read(HOME).match(/data-bar-color="([^"]+)"/);
    expect(found, `${HOME} sets data-bar-color`).not.toBeNull();
    expect(found![1]).toBe(stylesheetValue());
  });

  it('the attribute is a value, not a bare flag', () => {
    // A bare `data-bar-color` renders as "true", which the script would paint
    // onto the body verbatim. It reads the attribute rather than the cascade,
    // so nothing else would catch it.
    expect(read(HOME)).not.toMatch(/data-bar-color(?=[\s>])/);
  });

  it('the script reads the attribute rather than the cascade', () => {
    const layout = read(LAYOUT);
    expect(layout).toMatch(/getAttribute\('data-bar-color'\)/);
    expect(layout).not.toMatch(/getPropertyValue\('--bar-color'\)/);
  });

  it('the paint is cleared as well as applied', () => {
    // The section stops covering the bottom edge as soon as the page moves. A
    // paint that is never cleared would sit under every section below it.
    const layout = read(LAYOUT);
    expect(layout).toMatch(/addEventListener\('scroll', onScroll/);
    expect(layout).toMatch(/const want = color \|\| '';/);
  });
});
