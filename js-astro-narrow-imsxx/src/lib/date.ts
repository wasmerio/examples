import { siteConfig } from "@/config/site"

const locales: Record<string, string> = {
  "zh-hans": "zh-CN",
  en: "en-US",
}

type Variant = "long" | "short" | "month"

const options: Record<Variant, Intl.DateTimeFormatOptions> = {
  long: { year: "numeric", month: "long", day: "numeric" },
  short: { year: "numeric", month: "short", day: "numeric" },
  month: { year: "numeric", month: "long" },
}

export function formatDate(date: Date, variant: Variant = "long"): string {
  return new Intl.DateTimeFormat(locales[siteConfig.lang] ?? "zh-CN", {
    ...options[variant],
    timeZone: "Asia/Shanghai",
  }).format(date)
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
