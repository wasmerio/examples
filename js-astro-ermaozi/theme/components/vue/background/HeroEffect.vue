<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

const props = defineProps<{ effect: string, config?: Record<string, unknown> }>()
const effects = {
  beams: defineAsyncComponent(() => import('./Beams.vue')),
  'dark-veil': defineAsyncComponent(() => import('./DarkVeil.vue')),
  'dot-grid': defineAsyncComponent(() => import('./DotGrid.vue')),
  'hyper-speed': defineAsyncComponent(() => import('./HyperSpeed.vue')),
  iridescence: defineAsyncComponent(() => import('./Iridescence.vue')),
  lightning: defineAsyncComponent(() => import('./Lightning.vue')),
  'liquid-ether': defineAsyncComponent(() => import('./LiquidEther.vue')),
  orb: defineAsyncComponent(() => import('./Orb.vue')),
  'pixel-blast': defineAsyncComponent(() => import('./PixelBlast.vue')),
  prism: defineAsyncComponent(() => import('./Prism.vue')),
}
const component = computed(() => effects[props.effect as keyof typeof effects])
const root = useTemplateRef<HTMLDivElement>('root')
const visible = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!root.value || !('IntersectionObserver' in window)) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(entries => visible.value = entries[0]?.isIntersecting ?? false)
  observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template><div ref="root" class="home-hero-effect"><component :is="component" v-if="component && visible" v-bind="config || {}" /></div></template>

<style scoped>
.home-hero-effect {
  position: absolute;
  inset: 0;
}
</style>
