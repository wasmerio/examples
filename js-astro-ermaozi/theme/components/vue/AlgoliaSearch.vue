<script setup lang="ts">
import type { DocSearchProps } from '@docsearch/js'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import docsearchCss from '@docsearch/css?url'

type SearchOptions = Partial<DocSearchProps> & {
  provider?: 'local' | 'algolia'
  indexBase?: string
  keyboardShortcuts?: Record<string, boolean>
  locales?: Record<string, Partial<DocSearchProps>>
}

const props = withDefaults(defineProps<{
  lang: string
  localePath: string
  options: SearchOptions
}>(), { localePath: '/' })

const loaded = ref(false)
const loading = ref(false)
const containerId = 'docsearch-container'
let controller: { open: () => void } | undefined
const options = computed<SearchOptions>(() => {
  const { locales = {}, ...base } = props.options
  return { ...base, ...(locales[props.localePath] ?? locales[props.lang] ?? {}) }
})

const isApple = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)
const shortcutsEnabled = (event: KeyboardEvent) => {
  const shortcuts = options.value.keyboardShortcuts ?? {}
  return (shortcuts['Ctrl/Cmd+K'] !== false && event.key.toLowerCase() === 'k' && (isApple() ? event.metaKey : event.ctrlKey))
    || (shortcuts['/'] !== false && event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey)
}

const withLanguage = (indices: SearchOptions['indices'], indexName: string | undefined, searchParameters: SearchOptions['searchParameters']) =>
  (indices ?? [{ name: indexName ?? '', searchParameters }]).map((index) => {
    if (typeof index === 'string') return { name: index, searchParameters: { facetFilters: `lang:${props.lang}` } }
    const { searchParameters: parameters, ...rest } = index
    const filters = parameters?.facetFilters
    return {
      ...rest,
      searchParameters: {
        ...parameters,
        facetFilters: [`lang:${props.lang}`, ...(Array.isArray(filters) ? filters : filters == null ? [] : [filters])],
      },
    }
  })

const openModal = () => {
  controller?.open()
}

const load = async () => {
  if (loaded.value || loading.value) return
  loading.value = true
  try {
    const { default: docsearch } = await import('@docsearch/js')
    const { indexName, indices, searchParameters, indexBase = '/', provider: _provider, ...provider } = options.value
    const transformItems: NonNullable<DocSearchProps['transformItems']> = items => items.map((item) => {
      const url = new URL(item.url, new URL(indexBase, location.origin))
      return { ...item, url: `${url.pathname}${url.search}${url.hash}` }
    })
    const transformSearchClient: NonNullable<DocSearchProps['transformSearchClient']> = (client) => {
      let timer: ReturnType<typeof setTimeout>
      const search = ((...args: Parameters<typeof client.search>) => new Promise((resolve, reject) => {
        clearTimeout(timer)
        timer = setTimeout(() => client.search(...args).then(resolve, reject), 500)
      })) as typeof client.search
      return { ...client, search }
    }
    controller = docsearch({
      transformItems,
      navigator: { navigate: ({ itemUrl }) => location.assign(itemUrl) },
      transformSearchClient,
      ...provider,
      container: `#${containerId}`,
      indices: withLanguage(indices, indexName, searchParameters),
    } as DocSearchProps)
    loaded.value = true
    requestAnimationFrame(openModal)
  } finally {
    loading.value = false
  }
}

const onShortcut = (event: KeyboardEvent) => {
  if (!loaded.value && shortcutsEnabled(event)) {
    event.preventDefault()
    void load()
    window.removeEventListener('keydown', onShortcut)
  }
}

onMounted(() => {
  document.documentElement.classList.toggle('mac', isApple())
  window.addEventListener('keydown', onShortcut)
  if (!document.querySelector('#docsearch-style')) {
    const style = document.createElement('link')
    style.id = 'docsearch-style'
    style.rel = 'stylesheet'
    style.href = docsearchCss
    document.head.append(style)
  }
  const preconnect = () => {
    if (document.querySelector('#algolia-preconnect')) return
    const link = document.createElement('link')
    link.id = 'algolia-preconnect'
    link.rel = 'preconnect'
    link.href = `https://${options.value.appId}-dsn.algolia.net`
    link.crossOrigin = ''
    document.head.append(link)
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(preconnect)
  else setTimeout(preconnect)
})

onBeforeUnmount(() => window.removeEventListener('keydown', onShortcut))
</script>

<template>
  <div :id="containerId" :style="{ display: loaded ? 'block' : 'none' }" />
  <div v-if="!loaded" class="docsearch-placeholder" @click="load">
    <button
      type="button"
      :aria-label="options.translations?.button?.buttonAriaLabel ?? options.translations?.button?.buttonText ?? 'Search'"
      :aria-keyshortcuts="`${isApple() ? 'Command' : 'Control'}+k`"
      class="DocSearch DocSearch-Button"
    >
      <span class="DocSearch-Button-Container">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" class="DocSearch-Search-Icon">
          <circle cx="11" cy="11" r="8" stroke="currentColor" fill="none" stroke-width="1.4" />
          <path d="m21 21-4.3-4.3" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="DocSearch-Button-Placeholder">{{ options.translations?.button?.buttonText ?? 'Search' }}</span>
      </span>
      <span class="DocSearch-Button-Keys" aria-hidden="true">
        <kbd :class="['DocSearch-Button-Key', { 'DocSearch-Button-Key--ctrl': !isApple() }]">{{ isApple() ? '⌘' : 'Ctrl' }}</kbd>
        <kbd class="DocSearch-Button-Key">K</kbd>
      </span>
    </button>
  </div>
</template>
