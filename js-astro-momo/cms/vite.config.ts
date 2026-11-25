import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import { fileURLToPath } from 'node:url'

// 服务端目录整体外部化：由 Node 原生加载（import.meta / 顶层 await 正常工作），
// 博客插件链也顺带跳过 Vite SSR 转换，避免 transform 相关兼容问题
const serverDir = fileURLToPath(new URL('./server', import.meta.url))

export default defineConfig({
  server: {
    port: 5188,
    strictPort: true,
    watch: {
      // 忽略编辑器原子写入产生的临时文件，避免 Windows 下 EBUSY 崩溃
      ignored: ['**/*.tmp', '**/*.tmpdir/**'],
    },
  },
  ssr: {
    external: [serverDir],
  },
  plugins: [
    devServer({
      entry: 'server/index.mjs',
    }),
  ],
})
