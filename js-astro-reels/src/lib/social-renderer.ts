import satori from 'satori';
import sharp from 'sharp';
import type { Direction } from './seo.ts';
import { createCard } from './social-card.ts';

export interface SocialRenderInput {
  pageUrl: string;
  title: string;
  description: string;
  lang: string;
  dir?: Direction;
}
export interface SocialRenderer { render(input: SocialRenderInput): Promise<Uint8Array> }
export interface SocialAssets { regular: Uint8Array; bold: Uint8Array; icon: Uint8Array }

export async function createRenderer(assets: SocialAssets): Promise<SocialRenderer> {
  const regular = Buffer.from(assets.regular);
  const bold = Buffer.from(assets.bold);
  // satori draws <img> from data URLs but cannot parse raw SVG, so the mark is rasterized once.
  // 144px for a 72px draw keeps the blocks sharp on high-density previews.
  const icon = `data:image/png;base64,${(await sharp(Buffer.from(assets.icon)).resize(144, 144).png().toBuffer()).toString('base64')}`;
  return {
    async render(input) {
      const remedy = `${input.pageUrl}: cannot render the title card. Use a tested local font, a manual image or image=false.`;
      try {
        if (input.dir === 'rtl' || /[\u0590-\u08ff\u200f\u202b\u202e\u2067-\u2069\ufb1d-\ufdff\ufe70-\ufeff]/u.test(input.title)) {
          throw new Error('RTL card shaping has not been verified.');
        }
        const svg = await satori(createCard({ title: input.title, pageUrl: input.pageUrl, icon }), {
          width: 1200, height: 630,
          fonts: [
            { name: 'Noto Sans', data: regular, weight: 400, style: 'normal' },
            { name: 'Noto Sans', data: bold, weight: 700, style: 'normal' },
          ],
          loadAdditionalAsset: async (_code, text) => { throw new Error(`The local font cannot render ${JSON.stringify(text)}.`); },
        });
        const bytes = await sharp(Buffer.from(svg)).png().toBuffer();
        const { info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
        if (info.width !== 1200 || info.height !== 630) throw new Error('Expected a 1200x630 PNG.');
        return bytes;
      } catch (cause) {
        throw new Error(remedy, { cause });
      }
    },
  };
}
