/**
 * Build-time OG image rendering: satori (JSX-like tree → SVG) + resvg
 * (SVG → PNG). Zero client JS — every image is generated once at build time
 * by src/pages/og/[...path].png.ts.
 *
 * Card colors mirror the real theme tokens in src/styles/theme.css. satori
 * can't read CSS custom properties, so the resolved values are hardcoded here.
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);

const COLORS = {
  background: '#F5F4ED',
  foreground: '#141413',
  muted:      '#8A867C',
  border:     '#C7C3B9',
  clay:       '#d97757',
};

const WIDTH = 1200;
const HEIGHT = 630;

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 400 | 500 | 700; style: 'normal' }[]> | undefined;

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.resolve([
      {
        name: 'Literata',
        data: readFileSync(
          require.resolve('@fontsource/literata/files/literata-latin-400-normal.woff')
        ),
        weight: 400 as const,
        style: 'normal' as const,
      },
      {
        name: 'Literata',
        data: readFileSync(
          require.resolve('@fontsource/literata/files/literata-latin-700-normal.woff')
        ),
        weight: 700 as const,
        style: 'normal' as const,
      },
      {
        name: 'DM Mono',
        data: readFileSync(
          require.resolve('@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff')
        ),
        weight: 500 as const,
        style: 'normal' as const,
      },
    ]);
  }
  return fontsPromise;
}

export interface OgImageInput {
  eyebrow: string;
  title:   string;
  site:    string;
}

export async function renderOgImage({ eyebrow, title, site }: OgImageInput): Promise<Buffer> {
  const fonts = await loadFonts();

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width:  WIDTH,
          height: HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: COLORS.background,
          padding: '72px',
          fontFamily: 'Literata',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontFamily: 'DM Mono',
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: COLORS.muted,
              },
              children: eyebrow,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                fontFamily: 'Literata',
                fontSize: 64,
                fontWeight: 700,
                lineHeight: 1.15,
                color: COLORS.foreground,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderTop: `1px solid ${COLORS.border}`,
                paddingTop: '28px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: COLORS.clay,
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontFamily: 'DM Mono',
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: COLORS.muted,
                    },
                    children: site,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}
