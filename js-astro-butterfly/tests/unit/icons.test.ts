import { describe, expect, it } from 'vitest';
import { iconCss, iconUri } from '../../src/theme/icons-css';

const svgOf = (uri: string) => decodeURIComponent(uri.match(/^url\("data:image\/svg\+xml,(.*)"\)$/)![1]);

describe('CSS mask icons', () => {
  it('emit well-formed SVG: one xmlns, no currentColor', () => {
    const uris = iconCss.match(/url\("data:image\/svg\+xml,[^"]*"\)/g)!;
    expect(uris.length).toBeGreaterThan(30);
    for (const uri of uris) {
      const svg = svgOf(uri);
      // a repeated attribute is malformed XML: the browser drops the mask and the icon vanishes
      expect(svg.match(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g)).toHaveLength(1);
      expect(svg).not.toContain('currentColor');
    }
  });

  it('covers the code-block and clock icons', () => {
    for (const name of ['copy', 'check', 'angle-down', 'angles-down', 'cloud-sun', 'wind', 'droplet', 'location-dot']) {
      expect(svgOf(iconUri(name))).toMatch(/^<svg [^>]*viewBox="[^"]+"[^>]*>.*<\/svg>$/);
    }
  });
});
