<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import artalkCss from 'artalk/Artalk.css?url'
import walineCss from '@waline/client/waline.css?url'

type CommentConfig = Record<string, unknown> & {
  provider?: 'Artalk' | 'Giscus' | 'None' | 'Twikoo' | 'Waline'
  delay?: number
}

const props = defineProps<{ config: CommentConfig, identifier: string, lang: string, site: string, title: string }>()
const mount = ref<HTMLElement>()
const loading = ref(true)
const error = ref(false)
const provider = computed(() => props.config.provider ?? 'None')
const wrapperClass = computed(() => `${provider.value.toLowerCase()}-wrapper`)
const chinese = computed(() => props.lang.startsWith('zh'))
const giscusLocales = new Set('ar be bg ca cs da de en eo es eu fa fr gr hbs he hu id it ja kh ko nl pl pt ro ru th tr uk uz vi zh-CN zh-HK zh-TW'.split(' '))
const giscusLang = computed(() => giscusLocales.has(props.lang) ? props.lang : giscusLocales.has(props.lang.split('-')[0]) ? props.lang.split('-')[0] : 'en')
const twikooLang = computed(() => props.lang === 'zh-CN' ? 'zh-CN' : 'en')
let instance: { destroy?: () => void, setDarkMode?: (dark: boolean) => void } | null = null
let giscus: HTMLElement | null = null
let disposePageview: (() => void) | undefined

const dark = () => document.documentElement.dataset.theme === 'dark'
const options = () => {
  const { provider: _provider, delay: _delay, comment: _comment, ...rest } = props.config
  return rest
}
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const loadStyle = (href: string) => new Promise<void>((resolve, reject) => {
  const existing = document.querySelector<HTMLLinkElement>(`link[data-comment-style="${href}"]`)
  if (existing) return resolve()
  const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href })
  link.dataset.commentStyle = href
  link.addEventListener('load', () => resolve(), { once: true })
  link.addEventListener('error', reject, { once: true })
  document.head.append(link)
})

const syncTheme = () => {
  const isDark = dark()
  instance?.setDarkMode?.(isDark)
  if (giscus) {
    const theme = isDark ? props.config.darkTheme ?? 'dark' : props.config.lightTheme ?? 'light'
    ;(giscus as HTMLElement & { theme?: unknown }).theme = theme
    giscus.querySelector('iframe')?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app')
  }
}

onMounted(async () => {
  if (!mount.value || provider.value === 'None') return
  try {
    if (provider.value !== 'Giscus') await wait(props.config.delay ?? 800)
    if (provider.value === 'Giscus') {
      await import('giscus')
      const widget = document.createElement('giscus-widget') as HTMLElement & Record<string, unknown>
      Object.assign(widget, {
        repo: props.config.repo,
        repoId: props.config.repoId,
        category: props.config.category,
        categoryId: props.config.categoryId,
        lang: giscusLang.value,
        theme: dark() ? props.config.darkTheme ?? 'dark' : props.config.lightTheme ?? 'light',
        mapping: props.config.mapping ?? 'pathname',
        term: props.identifier,
        inputPosition: props.config.inputPosition ?? 'top',
        reactionsEnabled: props.config.reactionsEnabled === false ? '0' : '1',
        strict: props.config.strict === false ? '0' : '1',
        loading: props.config.lazyLoading === false ? 'eager' : 'lazy',
        emitMetadata: '0',
      })
      mount.value.append(widget)
      giscus = widget
    } else if (provider.value === 'Waline') {
      const [{ init }, pageview] = await Promise.all([import('@waline/client'), import('@waline/client/pageview'), loadStyle(walineCss)])
      instance = init({ lang: props.lang, dark: "[data-theme='dark']", ...options(), path: props.identifier, el: mount.value } as Parameters<typeof init>[0])
      if (props.config.pageview !== false) disposePageview = pageview.pageviewCount({ serverURL: String(props.config.serverURL), path: props.identifier })
    } else if (provider.value === 'Twikoo') {
      const { init } = await import('twikoo')
      await init({ lang: twikooLang.value, path: props.identifier, ...options(), el: mount.value })
    } else if (provider.value === 'Artalk') {
      const [{ default: Artalk }] = await Promise.all([import('artalk'), loadStyle(artalkCss)])
      instance = Artalk.init({ useBackendConf: false, site: props.site, pageTitle: props.title, ...options(), el: mount.value, pageKey: props.identifier, darkMode: dark() })
    }
    loading.value = false
  } catch (cause) {
    console.error(`[ermaozi] Failed to load ${provider.value} comments`, cause)
    loading.value = false
    error.value = true
  }
  document.addEventListener('theme-change', syncTheme)
})

onBeforeUnmount(() => {
  document.removeEventListener('theme-change', syncTheme)
  disposePageview?.()
  instance?.destroy?.()
})
</script>

<template>
  <div :id="provider === 'Artalk' ? undefined : 'comment'" :class="[wrapperClass, { 'input-top': provider === 'Giscus' && config.inputPosition !== 'bottom' }, 'vp-comment']" :data-comment-provider="provider" :aria-label="chinese ? '评论' : 'Comments'">
    <div v-if="loading" class="comment-loading" role="status" :aria-label="chinese ? '正在加载评论' : 'Loading comments'">
      <svg viewBox="25 25 50 50" aria-hidden="true"><g><animateTransform attributeName="transform" type="rotate" dur="2s" keyTimes="0;1" repeatCount="indefinite" values="0;360"/><circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" keyTimes="0;0.5;1" repeatCount="indefinite" values="1,200;90,200;1,200"/><animate attributeName="stroke-dashoffset" dur="1.5s" keyTimes="0;0.5;1" repeatCount="indefinite" values="0;-35;-125"/></circle></g></svg>
    </div>
    <p v-if="error" class="comment-error">{{ chinese ? '评论加载失败，请稍后重试。' : 'Comments failed to load. Please try again later.' }}</p>
    <div ref="mount" :id="provider === 'Twikoo' ? 'twikoo-comment' : undefined"></div>
  </div>
</template>

<style scoped>
.comment-loading { display: flex; align-items: center; justify-content: center; height: 96px; }
.comment-loading svg { width: 48px; height: 48px; }
.comment-error { color: var(--vp-c-danger-1); text-align: center; }
.giscus-wrapper.input-top :deep(.giscus) { margin-bottom: -3rem; }
.waline-wrapper { --waline-bg-color: var(--vp-c-bg); --waline-bg-color-light: var(--v-c-bg-alt); --waline-text-color: var(--vp-c-text); --waline-border: 1px solid var(--vp-c-border); --waline-border-color: var(--vp-c-border); --waline-theme-color: var(--vp-c-accent); --waline-active-color: var(--vp-c-accent-hover); }
</style>
