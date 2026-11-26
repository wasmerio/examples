import { siteConfig } from '../site.config.mjs'
import { localeOf } from './lib/locales.ts'
import { ref, watch, type Ref } from 'vue'
import Layout from './layouts/BaseLayout.astro'
import NotFound from './components/NotFound.astro'
import { withBase } from './lib/client-utils.ts'

export * from './lib/client-utils.ts'
export * from './lib/echarts-config.ts'

const browser = () => typeof document !== 'undefined'
let darkMode: Ref<boolean> | undefined
let darkModeBound = false

export function useDarkMode() {
  darkMode ??= ref(browser() && document.documentElement.dataset.theme === 'dark')
  if (browser() && !darkModeBound) {
    darkModeBound = true
    document.addEventListener('theme-change', () => { darkMode!.value = document.documentElement.dataset.theme === 'dark' })
    watch(darkMode, dark => {
      const lang = document.documentElement.lang
      const appearance = localeOf(lang).appearance ?? (siteConfig as { appearance?: boolean | 'dark' | 'force-dark' }).appearance ?? true
      const required = document.documentElement.classList.contains('force-dark') || appearance === 'force-dark' ? true : appearance === false ? false : dark
      if (required !== dark) { darkMode!.value = required; return }
      if (document.documentElement.dataset.theme === (dark ? 'dark' : 'light')) return
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', dark)
      localStorage.setItem('vuepress-theme-appearance', dark ? 'dark' : 'light')
      document.dispatchEvent(new CustomEvent('theme-change'))
    }, { flush: 'sync' })
  }
  return darkMode
}

const pageData = () => {
  if (!browser()) return { page: {}, frontmatter: {} }
  try { return JSON.parse(document.querySelector<HTMLScriptElement>('#ermaozi-page-data')?.textContent ?? '{}') }
  catch { return { page: {}, frontmatter: {} } }
}

export function useData() {
  const lang = browser() ? document.documentElement.lang : Object.keys(siteConfig.locales)[0]
  const data = pageData()
  return {
    theme: ref({ ...siteConfig, ...localeOf(lang) }),
    page: ref(data.page ?? {}),
    frontmatter: ref(data.frontmatter ?? {}),
    lang: ref(lang),
    site: ref(localeOf(lang)),
    isDark: useDarkMode(),
  }
}

const postLists = new Map<string, Ref<unknown[]>>()
const defaultPostCollection = (lang: string) => {
  const config = (siteConfig as any).locales?.[lang] ?? {}
  const dir = (config.collections ?? (siteConfig as any).collections)?.find((item: { type?: string }) => item.type === 'post')?.dir ?? 'blog'
  return `${lang}:${String(dir).replace(/^\/+|\/+$/gu, '')}`
}

export function useLocalePostList(lang = browser() ? document.documentElement.lang : Object.keys(siteConfig.locales)[0], collection = defaultPostCollection(lang)) {
  const key = collection.includes(':') ? collection : `${lang}:${collection}`
  if (!postLists.has(key)) {
    const posts = ref<unknown[]>([])
    postLists.set(key, posts)
    if (browser()) void fetch(withBase('/posts.json', import.meta.env.BASE_URL)).then(response => {
      if (!response.ok) throw new Error(`Unable to load posts: HTTP ${response.status}`)
      return response.json()
    }).then(data => { posts.value = data[lang]?.[key] ?? [] }).catch(error => console.error('[ermaozi] Unable to load posts', error))
  }
  return postLists.get(key)!
}

export { default as VPBadge } from './components/VPBadge.astro'
export { default as VPCard } from './components/VPCard.astro'
export { default as VPCardGrid } from './components/VPCardGrid.astro'
export { default as VPCardMasonry } from './components/VPCardMasonry.astro'
export { default as VPImageCard } from './components/VPImageCard.astro'
export { default as VPLinkCard } from './components/VPLinkCard.astro'
export { default as VPButton } from './components/VPButton.astro'
export { default as VPIcon } from './components/ThemeIcon.astro'
export { default as VPImage } from './components/VPImage.astro'
export { default as VPLink } from './components/VPLink.astro'
export { default as VPHomeBox } from './components/VPHomeBox.astro'
export { default as VPHomeBanner } from './components/VPHomeBanner.astro'
export { default as VPHomeCustom } from './components/VPHomeCustom.astro'
export { default as VPHomeDocHero } from './components/VPHomeDocHero.astro'
export { default as VPHomeFeatures } from './components/VPHomeFeatures.astro'
export { default as VPHomeHero } from './components/VPHomeHero.astro'
export { default as VPHomeProfile } from './components/VPHomeProfile.astro'
export { default as VPHomeTextImage } from './components/VPHomeTextImage.astro'
export { Layout, NotFound }
export const plumeClientConfig = Object.freeze({ layouts: Object.freeze({ Layout, NotFound }) })
