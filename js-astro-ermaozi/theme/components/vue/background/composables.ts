import { computed, onMounted, onUnmounted, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'

export function useDarkMode() {
  const dark = shallowRef(false)
  let observer: MutationObserver | undefined
  onMounted(() => {
    const update = () => { dark.value = document.documentElement.dataset.theme === 'dark' }
    update()
    observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  })
  onUnmounted(() => observer?.disconnect())
  return dark
}

export function useCssVar(prop: MaybeRefOrGetter<string | null | undefined>, initialValue = '') {
  const dark = useDarkMode()
  const variable = shallowRef(initialValue)
  watch([dark, () => toValue(prop)], () => {
    const key = toValue(prop)
    if (typeof window !== 'undefined' && key) variable.value = getComputedStyle(document.documentElement).getPropertyValue(key).trim() || variable.value
  }, { immediate: true, flush: 'post' })
  return computed(() => variable.value)
}
