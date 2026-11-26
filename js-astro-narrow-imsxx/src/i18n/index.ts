import { siteConfig } from "../config/site"
import { en } from "./en"
import { zhHans, type DeepPartial, type Dict } from "./zh-hans"
import { ar } from "./ar"
import { bn } from "./bn"
import { de } from "./de"
import { es } from "./es"
import { fr } from "./fr"
import { it } from "./it"
import { ja } from "./ja"
import { ko } from "./ko"
import { pt } from "./pt"
import { ru } from "./ru"
import { vi } from "./vi"
import { zh_hant } from "./zh-hant"

export type { Dict, DeepPartial }

const dictionaries: Record<string, DeepPartial<Dict>> = {
  "zh-hans": zhHans,
  "zh-hant": zh_hant,
  en,
  ar,
  bn,
  de,
  es,
  fr,
  it,
  ja,
  ko,
  pt,
  ru,
  vi,
}

/** Merge a partial translation over the English baseline. */
function merge<T extends object>(base: T, patch: DeepPartial<T>): T {
  const result = { ...base } as Record<string, unknown>
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue
    const current = result[key]
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      current &&
      typeof current === "object" &&
      !Array.isArray(current)
    ) {
      result[key] = merge(current as object, value as DeepPartial<object>)
    } else {
      result[key] = value
    }
  }
  return result as T
}

const baseline: Dict = siteConfig.lang === "zh-hans" ? zhHans : en
const overlay = dictionaries[siteConfig.lang]

export const t: Dict =
  siteConfig.lang === "zh-hans"
    ? zhHans
    : overlay
      ? merge(baseline, overlay)
      : baseline

export const isRtl = siteConfig.lang === "ar"
