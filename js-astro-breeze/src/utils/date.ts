import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import site from "@/config/site";

dayjs.extend(relativeTime);

// Dynamically load locale based on site config
const langMap: Record<string, () => Promise<any>> = {
  "zh-CN": () => import("dayjs/locale/zh-cn"),
  "zh-TW": () => import("dayjs/locale/zh-tw"),
  en: () => import("dayjs/locale/en"),
  ja: () => import("dayjs/locale/ja"),
  ko: () => import("dayjs/locale/ko"),
};

const lang = site.meta.lang;
const loader = langMap[lang] || langMap[lang.split("-")[0]];
if (loader) {
  await loader();
  dayjs.locale(lang.toLowerCase());
}

export function formatDate(d: string | Date, format: string = "YYYY.MM.DD") {
  const date = dayjs(d);
  return date.format(format);
}

export function formatRelativeDate(d: string | Date) {
  const date = dayjs(d);
  return date.fromNow();
}
