import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./figure.css', import.meta.url), 'utf8');
const proseCss = readFileSync(new URL('./prose.css', import.meta.url), 'utf8');

describe('wide figure layout', () => {
  it('keeps wide content inside prose column when TOC or series rail is present', () => {
    expect(css).not.toContain('.wisp-has-toc:not(.wisp-has-series) .wisp-wide');
    expect(css).toMatch(
      /\.wisp-has-toc \.wisp-wide,\s*\.wisp-has-series \.wisp-wide\s*\{[\s\S]*?--wisp-wide-w: 100%;[\s\S]*?margin-inline: 0;/,
    );
  });
  it('centers wide prose content instead of inheriting figure margin', () => {
    expect(css).toMatch(
      /\.prose \.wisp-wide\s*\{[\s\S]*?margin-inline: calc\(\(100% - var\(--wisp-wide-w\)\) \/ 2\);/,
    );
  });
  it('styles diagram actions with a unified bordered toolbar pill and divider across mobile and desktop', () => {
    expect(css).toMatch(/\.wisp-fig-actions\s*\{[\s\S]*?border: 1px solid var\(--wisp-border\);/);
    expect(css).toMatch(/\.wisp-fig-actions > a \+ a::before\s*\{[\s\S]*?width: 1px;/);
  });
  it('floats diagram actions at top-right on hover-capable desktop and falls back below on touch/narrow', () => {
    expect(css).toContain('@media (min-width: 40rem) and (hover: hover) and (pointer: fine)');
    expect(css).toMatch(/\.wisp-diagram > \.wisp-fig-actions\s*\{[\s\S]*?position: absolute;/);
    expect(css).toMatch(
      /\.wisp-diagram:hover > \.wisp-fig-actions,\s*\.wisp-diagram:focus-within > \.wisp-fig-actions\s*\{[\s\S]*?opacity: 1;/,
    );
  });
  it('delegates Mermaid horizontal overflow cue to mask-image without legacy gradient scroll shadows', () => {
    expect(css).toContain('overscroll-behavior-x: contain');
    expect(css).not.toContain('no-repeat scroll');
  });
  it('frames all figure images including standalone SVG figures with a 1px semantic border', () => {
    expect(css).toMatch(/\.wisp-figure > img\s*\{[\s\S]*?border: 1px solid var\(--wisp-border\);/);
    expect(css).not.toContain(".wisp-figure > img:not([src$='.svg' i])");
  });
  it('lifts max-width:100% unconditionally on narrow tables via container query so sticky col-1 and data columns keep readable bounds', () => {
    expect(proseCss).toContain('@container (max-width: 36rem)');
    expect(proseCss).toMatch(/\.prose \.wisp-table > table\s*\{[\s\S]*?max-width: none;/);
    expect(proseCss).not.toMatch(/\.prose \.wisp-table\[data-wisp-overflow\] > table/);
  });
  it('wraps narrow table cells unconditionally without gating on [data-wisp-overflow]', () => {
    const start = proseCss.indexOf('@container (max-width: 36rem)');
    const end = proseCss.indexOf('@media (max-width: 40rem)', start);
    const narrowTableBlock = proseCss.slice(start, end);
    expect(narrowTableBlock).toMatch(
      /\.prose \.wisp-table :is\(th, td\):first-child:not\(\[colspan\]\)\s*\{/,
    );
    expect(narrowTableBlock).toMatch(
      /\.prose \.wisp-table :is\(th, td\):not\(:first-child\):not\(\[colspan\]\)\s*\{/,
    );
    expect(narrowTableBlock).toMatch(
      /\.prose \.wisp-table td\[data-wisp-prose\]:not\(:first-child\)\s*\{/,
    );
    expect(narrowTableBlock).not.toMatch(/\.wisp-table\[data-wisp-overflow\]\s+:is\(th, td\)/);
    expect(narrowTableBlock).not.toMatch(/\.wisp-table\[data-wisp-overflow\]\s+td/);
  });
  it('keeps wide figures symmetric instead of breaking asymmetrically into the left rail', () => {
    expect(css).not.toMatch(/\.wisp-has-toc:not\(\.wisp-has-series\) \.wisp-wide/);
  });
});
