import type { ImageMetadata } from "astro";
import type {
  Section,
  TimelineEntry,
  HighlightEntry,
  CardEntry,
} from "@/data/sections";
import coverTide from "../assets/discography/tide.jpg";
import coverNight from "../assets/discography/night.jpg";
import coverDawn from "../assets/discography/dawn.jpg";

export type Experience = {
  period: string;
  title: string;
  /** Focus areas, rendered in a tinted note block separated by rules. */
  duties: { name: string; text: string }[];
};

export type Education = {
  period: string;
  school: string;
  degree: string;
  /** Thesis title, for degrees that have one. */
  thesis?: string;
  /** What the thesis did, in a paragraph. */
  description?: string;
};

/** A dated public achievement: awards, talks, community work. */
export type Highlight = {
  date: string;
  title: string;
  detail?: string;
  /** An extra line, e.g. a project's one-line pitch. */
  note?: string;
};

// Photo: Baruk Granda, https://unsplash.com/photos/OHLRskxOpjI (Unsplash
// License — free to use, modify, and redistribute; see
// https://unsplash.com/license). On-stage silhouette, no visible face —
// the musician identity, so it also fronts blog posts (BlogPost.astro).
import avatarWork from "../assets/avatar-work.jpg";
/** Work-face avatar (the Life face keeps data/life.ts's AVATAR). */
export const AVATAR_WORK = avatarWork;

/** A released work — repurposed from a certification-style card. */
export type Discography = {
  name: string;
  issuer: string;
  year: string;
  /** Imported cover art or a full https:// URL; omit for a placeholder. */
  img?: ImageMetadata | string;
};

// Dates read `YYYY.MM`, kept short: the timeline renders them in a
// nowrap column, and a wider one squeezes the entry beside it.

export const PROFILE = {
  name: "拍岸",
  headline: "創作歌手・製作人",
  bio: [
    "目前隸屬浪聲唱片，身兼創作歌手與製作人，曲風橫跨民謠、電子與爵士，不喜歡被單一標籤定義。",
    "出道前在各地的展演空間駐唱多年，靠一把吉他跟一本寫滿塗改的歌詞本，慢慢找到屬於自己的聲音。",
  ],
};

// Placeholder career history — obviously-fake demo content. Replace every
// value below with your own history; the shapes are what Section.astro
// expects.
export const EXPERIENCE: Experience[] = [
  {
    period: "2023.06 – 至今",
    title: "浪聲唱片 · 簽約歌手／製作人",
    duties: [
      {
        name: "《潮汐圖》製作",
        text: "身兼創作與製作，融合電子節拍與弦樂編制，主打單曲登上多個串流平台週榜前列。",
      },
      {
        name: "「浪跡」巡迴演出",
        text: "統籌全長 18 場的巡迴演出，並參與燈光與舞台腳本設計。",
      },
    ],
  },
  {
    period: "2019.03 – 2023.05",
    title: "拂曉音樂工作室 · 駐店創作歌手",
    duties: [
      {
        name: "客座填詞",
        text: "為工作室旗下新人樂團擔任客座填詞人，累積超過四十首合作作品。",
      },
    ],
  },
];

// Newest first, matching the timeline above.
export const EDUCATION: Education[] = [
  {
    period: "2015.09 – 2019.06",
    school: "臨海音樂學苑",
    degree: "現代音樂創作組",
    thesis: "畢業製作《潮間帶》",
    description:
      "採集海邊城市四季的環境聲音，混音成一張以民謠編曲為底的畢業作品。",
  },
];

// Placeholder skill tags — swap in your own.
export const SKILLS: string[] = [
  "作曲",
  "填詞",
  "編曲",
  "鋼琴",
  "吉他",
  "混音",
  "現場演出",
  "多語言演唱",
];

// Career highlights, newest first.
export const HIGHLIGHTS: Highlight[] = [
  {
    date: "2025.11",
    title: "金浪獎",
    detail: "年度最佳跨界創作歌手",
    note: "以專輯《潮汐圖》入圍三項，抱回一座。",
  },
  {
    date: "2022.07",
    title: "戶外音樂季閉幕壓軸",
    detail: "生涯第一次站上萬人舞台",
  },
];

// Cover credits (Unsplash License — free to use and modify; no third-party
// brand or face visible):
// - tide.jpg:  Mamun Srizon, https://unsplash.com/photos/pSPoLYF_AAA
// - night.jpg: Tsuyoshi Kozu, https://unsplash.com/photos/luAFESue6Ws
// - dawn.jpg:  Alan Jones, https://unsplash.com/photos/OQsxdghBKrU
export const DISCOGRAPHY: Discography[] = [
  {
    name: "《潮汐圖》",
    issuer: "浪聲唱片",
    year: "2025",
    img: coverTide,
  },
  {
    name: "《夜行動物園》",
    issuer: "浪聲唱片",
    year: "2023",
    img: coverNight,
  },
  {
    name: "《拂曉前》EP",
    issuer: "拂曉音樂工作室",
    year: "2020",
    img: coverDawn,
  },
];

// --- Section-block wiring for AboutProfessional -----------------------
// Splits a "start – end" period into its parts; a bare value (no " – ",
// e.g. a project's plain year) yields `start` only.
const splitPeriod = (period: string): { start: string; end?: string } => {
  const [start, end] = period.split(" – ");
  return { start, end };
};

// Combines a Highlight's optional `detail`/`note` into the single
// `subtitle` line the generic HighlightEntry has room for.
const joinDetail = (...parts: (string | undefined)[]): string | undefined =>
  parts.filter(Boolean).join(" · ") || undefined;

const EXPERIENCE_ENTRIES: TimelineEntry[] = EXPERIENCE.map((e) => ({
  title: e.title,
  ...splitPeriod(e.period),
  duties: e.duties,
}));

const EDUCATION_ENTRIES: TimelineEntry[] = EDUCATION.map((e) => ({
  title: e.school,
  subtitle: e.degree,
  ...splitPeriod(e.period),
  duties: e.thesis
    ? [{ name: `論文：${e.thesis}`, text: e.description ?? "" }]
    : undefined,
}));

const HIGHLIGHTS_ENTRIES: HighlightEntry[] = HIGHLIGHTS.map((h) => ({
  title: h.title,
  subtitle: joinDetail(h.detail, h.note),
  date: h.date,
}));

const DISCOGRAPHY_CARDS: CardEntry[] = DISCOGRAPHY.map((d) => ({
  title: d.name,
  subtitle: `${d.issuer} · ${d.year}`,
  img: d.img ?? "",
}));

// Quick-facts strip; playful values are deliberate (this is placeholder data).
const STATS_TILES: { value: string; label: string }[] = [
  { value: "3", label: "張專輯" },
  { value: "62", label: "場巡演" },
  { value: "180+", label: "首詞曲" },
];

// Fictional fan-site/label link placeholders — swap in your own.
const LINKS: { label: string; url: string; note?: string }[] = [
  {
    label: "浪聲唱片｜藝人頁面",
    url: "https://example.com/labels/wave-sound/pai-an",
    note: "官方資料",
  },
  {
    label: "遙聲電台（粉絲站）",
    url: "https://example.com/fansites/echo-radio",
    note: "非官方彙整",
  },
];

export const PROFESSIONAL_SECTIONS: Section[] = [
  // Intro paragraphs come from PROFILE.bio so the identity card and this
  // section stay in sync.
  { type: "text", title: "關於", paragraphs: PROFILE.bio },
  { type: "stats", title: "數據一覽", tiles: STATS_TILES },
  { type: "timeline", title: "經歷", entries: EXPERIENCE_ENTRIES },
  { type: "timeline", title: "學歷", entries: EDUCATION_ENTRIES },
  { type: "chips", title: "技能", items: SKILLS },
  { type: "highlights", title: "亮點", entries: HIGHLIGHTS_ENTRIES },
  { type: "cards", title: "代表作", cards: DISCOGRAPHY_CARDS },
  { type: "links", title: "連結", links: LINKS },
];
