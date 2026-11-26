import type { IconName } from "@/components/icons";
import type { Section, CardEntry } from "@/data/sections";
import { TROPHIES } from "@/data/trophies";

// Photo: Nikolett Emmert, https://unsplash.com/photos/PR7J4fH6EGU (Unsplash
// License — free to use, modify, and redistribute; see
// https://unsplash.com/license). A cat, matching the persona's interests —
// the no-visible-face rule only binds HUMAN faces.
import avatarLife from "../assets/avatar-life.jpg";
/** Life-face avatar (the Work face has its own, see data/about.ts). */
export const AVATAR = avatarLife;

// Casual self-intro — obviously-fake demo persona.
const INTRO = [
  "白天在錄音室裡調和聲，晚上巷口手搖飲店打烊前一定會出現。",
  "寫歌大多在半夜兩三點最清醒，靈感常常來自超商關東煮的蒸氣。",
  "私底下怕生，一站上舞台就完全變了一個人。",
];

// Interests as tags (like the Work face's Skills).
const INTERESTS = [
  "手搖飲",
  "魔術",
  "籃球",
  "老電影",
  "電玩",
  "貓咪",
  "深夜廣播",
  "黑膠收藏",
];

// Placeholder gear cards, mic first then monitoring and instrument.
// `href` is optional — with it the whole card links out (e.g. to a store
// page); without it the card is a plain tile.
const GEAR: { label: string; item: string; icon: IconName; href?: string }[] = [
  {
    label: "麥克風",
    item: "聲學 AT-01 麥克風",
    icon: "microphone",
    href: "https://example.com/shop/at-01",
  },
  {
    label: "監聽耳機",
    item: "聲學 IH-02 監聽耳機",
    icon: "headphones",
    href: "https://example.com/shop/ih-02",
  },
  {
    label: "主奏吉他",
    item: "聲學 GT-3 木吉他",
    icon: "guitar",
  },
];

const TROPHY_CARDS: CardEntry[] = TROPHIES.map((trophy) => ({
  title: trophy.caption,
  img: trophy.src,
}));

// Freeform catch-all — demonstrates the markdown block (list + bold text).
const MISC_BODY = `有些話沒有適合的區塊可以放，這一區就是留給那些內容的。

**最近在忙的事：**

- 想把上次巡演的和聲重新錄一次
- 練習邊彈吉他邊切效果器，還沒成功
- 手搖飲喝到一半突然想到一句歌詞，衝回家寫`;

export const PERSONAL_SECTIONS: Section[] = [
  { type: "text", title: "關於", paragraphs: INTRO },
  { type: "chips", title: "興趣", items: INTERESTS },
  { type: "cards", title: "人生成就", cards: TROPHY_CARDS },
  {
    type: "kv",
    title: "器材",
    rows: GEAR.map((g) => ({
      label: g.label,
      value: g.item,
      icon: g.icon,
      href: g.href,
    })),
  },
  { type: "markdown", title: "其他", body: MISC_BODY },
];
