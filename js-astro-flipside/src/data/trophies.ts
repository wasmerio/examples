// The Life face's trophy wall. Drop screenshots into src/assets/trophies/,
// import them, and list them here — an entry without `src` renders a
// placeholder box. Swap in your own achievements.
//
// Photo provenance (Unsplash/Pexels only, same rule as src/data/gallery.ts):
//   trophy-01.jpg — Georgios Kaleadis, https://unsplash.com/photos/aBTfTMsOCOI
//   trophy-02.jpg — Isabella Mendes (Pexels), https://www.pexels.com/photo/red-lights-on-a-stage-5389623/
import type { ImageMetadata } from "astro";
import trophy01 from "../assets/trophies/trophy-01.jpg";
import trophy02 from "../assets/trophies/trophy-02.jpg";

export type Trophy = {
  /** Imported image; omit it to render a placeholder box. */
  src?: ImageMetadata;
  caption: string;
};

export const TROPHIES: Trophy[] = [
  {
    src: trophy01,
    caption:
      "《深夜浪》拿下金浪獎最佳創作歌手——得獎旋律其實是深夜即興哼出來的，手機忘記按下錄音鍵。",
  },
  {
    src: trophy02,
    caption: "金浪獎頒獎典禮候補開場，緊張到把整首歌的詞唱成另一首的調。",
  },
];
