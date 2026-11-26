// Drop photos into src/assets/gallery/, import them, and list them here —
// array order is display order (the masonry layout does not resort). An
// imported `src` ships through astro:assets (responsive sizes, webp); a
// full https:// URL string also works and is used as-is. `alt` is
// required: unlike the decorative avatar/hero images elsewhere, a gallery
// photo IS the content. `caption` is optional and renders under the image
// (and in the lightbox) when set.
//
// Photo provenance: every gallery-*.jpg is sourced from Unsplash or Pexels
// only. Both licenses are free to use, modify, and redistribute (including
// commercially), with no permission required; attribution is appreciated
// but not required. See https://unsplash.com/license and
// https://www.pexels.com/license/. Credits below, one per photo, in array
// order:
//   gallery-01.jpg — Elijah Ekdahl, https://unsplash.com/photos/8XxF2kYHIgo
//   gallery-02.jpg — Leo Wieling, https://unsplash.com/photos/bG8U3kaZltE
//   gallery-03.jpg — Luwadlin Bosman, https://unsplash.com/photos/vWqS1iTz0hg
//   gallery-04.jpg — yx b (Pexels), https://www.pexels.com/photo/city-skyline-during-night-time-12841258/
//   gallery-05.jpg — Sóc Năng Động (Pexels), https://www.pexels.com/photo/delicious-iced-bubble-tea-on-wooden-table-34511977/
//   gallery-06.jpg — Gvz 42, https://unsplash.com/photos/RyoPLIFEI7c
//   gallery-07.jpg — Malcolm Garret (Pexels), https://www.pexels.com/photo/grayscale-photo-of-basketball-courts-9488949/
//   gallery-08.jpg — Nihar Manyalli (Pexels), https://www.pexels.com/photo/aerial-view-of-clouds-through-airplane-window-35173466/
//   gallery-09.jpg — Marc Fanelli Isla, https://unsplash.com/photos/xo4ValczbuA
//   gallery-10.jpg — Steven Erixon, https://unsplash.com/photos/IzwvpT7gGgU
import type { ImageMetadata } from "astro";
import gallery01 from "../assets/gallery/gallery-01.jpg";
import gallery02 from "../assets/gallery/gallery-02.jpg";
import gallery03 from "../assets/gallery/gallery-03.jpg";
import gallery04 from "../assets/gallery/gallery-04.jpg";
import gallery05 from "../assets/gallery/gallery-05.jpg";
import gallery06 from "../assets/gallery/gallery-06.jpg";
import gallery07 from "../assets/gallery/gallery-07.jpg";
import gallery08 from "../assets/gallery/gallery-08.jpg";
import gallery09 from "../assets/gallery/gallery-09.jpg";
import gallery10 from "../assets/gallery/gallery-10.jpg";

export type GalleryPhoto = {
  src: ImageMetadata | string;
  alt: string;
  caption?: string;
};

export const GALLERY: GalleryPhoto[] = [
  {
    src: gallery01,
    alt: "表演開始前，打好燈光的空舞台。",
    caption: "沒有觀眾的舞台，燈光還是很誠實。",
  },
  {
    src: gallery02,
    alt: "錄音室裡的電容式麥克風與防噴罩特寫。",
    caption: "同一句歌詞，錄到第十二次。",
  },
  {
    src: gallery03,
    alt: "吉他琴頸與弦的黑白特寫，撥片夾在弦間。",
    caption: "這把吉他，和弦記得比我熟。",
  },
  {
    src: gallery04,
    alt: "夜晚的城市天際線，橋樑燈光倒映在河面上。",
    caption: "每座城市的夜景都很像，只有河面的燈不一樣。",
  },
  {
    src: gallery05,
    alt: "木桌上一杯珍珠奶茶，背景有綠色植物。",
    caption: "熬夜寫歌，靠這杯撐到副歌。",
  },
  {
    src: gallery06,
    alt: "鋼琴琴鍵與樂譜的黑白特寫。",
    caption: "手稿上的修改，比琴鍵上的指紋還多。",
  },
  {
    src: gallery07,
    alt: "透過鐵絲網看到的黑白籃球場，空無一人。",
    caption: "寫不出歌的下午，投籃比寫詞痛快。",
  },
  {
    src: gallery08,
    alt: "飛機窗外的雲海，機艙內部偏暗。",
    caption: "還沒到，但已經開始想下一站的舞台。",
  },
  {
    src: gallery09,
    alt: "錄音室混音台特寫，控制鈕與推桿排列整齊。",
    caption: "混音混到天亮，耳朵比眼睛先累。",
  },
  {
    src: gallery10,
    alt: "舞台上對著麥克風唱歌的剪影。",
    caption: "剪影的好處是，忘詞也看不出來。",
  },
];
