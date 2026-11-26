/// <reference types="astro/client" />

declare module 'markdown-it-container'
declare module 'katex/dist/contrib/copy-tex.min.js'
declare module 'twikoo' {
  export function init(options: Record<string, unknown>): Promise<void>
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
