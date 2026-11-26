import type { ImageMetadata } from "astro";
import imgTemplate from "../../docs/hero.jpg";
import imgLyrics from "../assets/gallery/gallery-06.jpg";
import imgDemos from "../assets/gallery/gallery-09.jpg";

export type Project = {
  name: string;
  description: string;
  tech: string[];
  url: string;
  /** Cover image above the block — an imported asset or an https URL. */
  img?: ImageMetadata | string;
};

// Demo entries — replace with your own projects. Rendered by /projects/.
export const PROJECTS: Project[] = [
  {
    name: "這個範本",
    description: "你現在看到的這個會翻面的個人網站。",
    tech: ["Astro", "TypeScript"],
    url: "https://github.com/your-name/astro-flipside",
    img: imgTemplate,
  },
  {
    name: "歌詞本",
    description: "把手寫歌詞整理成可以分享的網頁，支援段落標記和押韻高亮。",
    tech: ["Astro", "CSS"],
    url: "https://github.com/your-name/lyrics-book",
    img: imgLyrics,
  },
  {
    name: "demo 架",
    description: "錄音 demo 的整理架，按日期和調性歸檔，附試聽波形。",
    tech: ["TypeScript", "Web Audio"],
    url: "https://github.com/your-name/demo-shelf",
    img: imgDemos,
  },
];
