import type { ImageMetadata } from "astro";
import heroImage from "@/assets/hero.jpg";
// プロフィール画像を src/assets に置く場合は、hero と同じようにここで import する
// import avatarImage from "@/assets/avatar.png";

export const siteConfig = {
  title: "My Blog",
  subtitle: "Astro Theme Demo",
  lang: "ja",
  description: "A soft, pastel blog theme for Astro",
  // 0 - 360 のテーマカラー(hue)
  pageSize: 5,
  // 日付の表記。YYYY YY MMMM MMM MM M DD D が使える。[ ] で囲むとそのまま出力される
  //   例: "YYYY-MM-DD" / "YYYY/MM/DD" / "MMM D, YYYY" / "YYYY年M月D日" / "D MMMM YYYY"
  dateFormat: "MMM D, YYYY",
  // アーカイブページの日付 (年は見出しにあるので月日だけ)
  archiveDateFormat: "MMM D",
  // 月名 (MMMM, MMM) の言語。例: "en-US" / "ja-JP" / "fr-FR"
  dateLocale: "en-US",
  themeHue: 250,
  hero: {
    // src/assets 配下の画像を import する (Astro の画像最適化の対象になる)
    image: heroImage,
    title: "My Blog",
    subtitle: "A soft and easygoing blog",
  },
};

export const profileConfig = {
  name: "Your Name",
  // プロフィール画像。次のいずれか (空なら名前の頭文字を表示)
  //  - src/assets の画像を import したもの (推奨: WebP変換・サイズ最適化される)
  //  - 外部URL / public 配下のパス ("/avatar.png") の文字列 (そのまま表示。最適化はされない)
  avatar: "" as ImageMetadata | string,
  bio: "Write a short bio here.",
  links: [
    { name: "GitHub", icon: "tabler:brand-github", url: "https://github.com" },
    { name: "X", icon: "tabler:brand-x", url: "https://x.com" },
  ],
};

export const navLinks = [
  { name: "Archive", url: "/archive" },
  { name: "Tags", url: "/tags" },
  { name: "Categories", url: "/categories" },
  { name: "About", url: "/about" },
];
