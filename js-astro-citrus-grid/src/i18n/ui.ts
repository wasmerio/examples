import type { Lang } from '@/lib/url'
import en from './en.json'
import ja from './ja.json'
import zh from './zh.json'

export type { Lang } from '@/lib/url'
export { defaultLang, getLangFromUrl, langs, localePath } from '@/lib/url'

type Prev = [never, 0, 1, 2, 3, 4, 5]
type Paths<T, D extends number = 5> = D extends 0
  ? never
  : {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? `${K}.${Paths<T[K], Prev[D]>}`
        : K
    }[keyof T & string]

export type MessageKey = Paths<typeof zh>

export type MessageParams = Record<string, string | number>

const messages: Record<Lang, Record<string, unknown>> = { zh, ja, en }

const isDev = import.meta.env.DEV === true

export function useTranslations(lang: Lang) {
  return function t(key: MessageKey, params?: MessageParams): string {
    const value = key
      .split('.')
      .reduce<unknown>(
        (acc, k) =>
          acc != null && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined,
        messages[lang],
      )
    if (typeof value !== 'string' && isDev) {
      console.warn(`[i18n] missing message: ${key} (${lang}.json)`)
    }
    let text = typeof value === 'string' ? value : key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        // 函数式替换：字符串 replacement 中 $&、$' 等序列会被特殊展开
        text = text.replaceAll(`{${k}}`, () => String(v))
      }
    }
    return text
  }
}
