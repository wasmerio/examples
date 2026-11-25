/**
  Twikoo 评论适配器，基于 https://twikoo.js.org ：
  自建后端（腾讯云开发 / Vercel / 自托管等）的轻量评论系统，评论无需第三方账号登录。

  启用方式：site.config.ts 设置 `commentScript: twikoo`，并在下方配置区填写 envId。
  适配器契约详见同目录《使用规则.md》。
 */

// ========== 配置区：使用前在这里填写你的 twikoo 设置 ==========
const config = {
  // 必填：Twikoo 后端地址。
  // 腾讯云开发部署：填环境 ID（形如 'xxx-0000000000000000'）；
  // Vercel / 自托管部署：填完整地址（形如 'https://your-twikoo.vercel.app'）。
  // 留空则评论区停用（控制台会提示）。
  envId: '',
  // 可选：环境地域，仅腾讯云开发需要，默认 ap-shanghai；
  // 若你的云开发环境地域不是上海，填 'ap-shanghai' 或 'ap-guangzhou' 等；Vercel/自托管留空。
  region: '',
  // 可选：手动指定评论区语言（如 'zh-CN'、'en'），留空则跟随浏览器语言。
  // 支持的语言列表见 https://github.com/twikoojs/twikoo/blob/main/src/client/utils/i18n/index.js
  lang: '',
  // Twikoo 前端脚本地址，建议锁定版本号避免不兼容更新，按需替换为自建 CDN 或 npm 镜像。
  scriptSrc: 'https://cdn.jsdelivr.net/npm/twikoo@1/dist/twikoo.min.js',
}
// =================================================================

// twikoo 脚本加载后挂载的全局对象（仅本适配器用到 init，其余 API 未用到不声明）
declare global {
  interface Window {
    twikoo?: {
      init: (options: Record<string, unknown>) => Promise<unknown>
    }
  }
}

// 脚本整个会话只需加载一次；用 Promise 缓存，避免 Swup 换页重复注入 <script>
let scriptPromise: Promise<void> | null = null

// Twikoo 脚本首次执行时会向 <head> 注入一份 <style>（非按每次 init() 注入，只在脚本求值时注入一次）。
// Swup 换页是按“新页面原始 HTML”与当前 <head> 做 diff，这份运行时动态插入、从未出现在任何
// 服务端 HTML 里的样式标签必然对不上号，于是每次换页都会被摘掉——回到评论页时脚本已缓存、
// 不会重新执行，样式也就不会重新注入，只能整页刷新才能恢复。这里在首次加载时把新增的
// <style> 内容记下来，之后每次挂载前检查是否还在，不在就补插回去，从根源避免依赖整页刷新。
let cachedStyleHTML: string[] = []

function currentHeadStyleHTML(): Set<string> {
  return new Set(Array.from(document.head.querySelectorAll('style')).map((el) => el.outerHTML))
}

function restoreMissingStyles(): void {
  if (!cachedStyleHTML.length) return
  const present = currentHeadStyleHTML()
  for (const html of cachedStyleHTML) {
    if (present.has(html)) continue
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    const styleEl = wrapper.firstElementChild
    if (styleEl) document.head.appendChild(styleEl)
  }
}

function loadScript(): Promise<void> {
  if (window.twikoo) {
    // 脚本已在本次会话加载过：不会再重新求值、不会再重新注入样式，
    // 换页后若样式被 Swup 摘掉，这里负责补回来。
    restoreMissingStyles()
    return Promise.resolve()
  }
  if (!scriptPromise) {
    const stylesBefore = currentHeadStyleHTML()
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = config.scriptSrc
      script.async = true
      script.onload = () => {
        // 脚本求值期间新增的 <style> 即 Twikoo 自带样式，记录下来供后续换页时复原
        const stylesAfter = currentHeadStyleHTML()
        cachedStyleHTML = Array.from(stylesAfter).filter((html) => !stylesBefore.has(html))
        resolve()
      }
      script.onerror = () =>
        reject(new Error(`[comments] twikoo 脚本加载失败：${config.scriptSrc}`))
      document.head.appendChild(script)
    }).catch((err) => {
      // 加载失败不缓存，允许下次挂载（如换页、网络恢复后）重新尝试
      scriptPromise = null
      throw err
    })
  }
  return scriptPromise
}

// 挂载评论（契约必选）：确保 twikoo 脚本已加载后，将其 init 进容器
// twikoo.init 本身支持在同一容器上重复调用以重新挂载/刷新，故每次页面加载直接调用即可，
// 无需适配器自行判重；path 显式传当前 pathname，避免 Swup 换页时取到旧路径。
export async function mountComment(container: HTMLElement): Promise<void> {
  if (!config.envId) {
    throw new Error('[comments] twikoo.envId 未配置，请编辑 src/comments/twikoo.ts 填写 envId')
  }

  await loadScript()
  if (!window.twikoo) {
    throw new Error('[comments] twikoo 脚本加载完成但未找到全局 twikoo 对象')
  }

  await window.twikoo.init({
    envId: config.envId,
    el: container,
    path: location.pathname,
    ...(config.region ? { region: config.region } : {}),
    ...(config.lang ? { lang: config.lang } : {}),
  })
}

// 注：Twikoo 评论区直接渲染进页面 DOM（不像 utterances/giscus 那样运行在 iframe 里），
// 官方也未提供运行时切换主题的 JS API —— 深色模式由 Twikoo 自带的
// `prefers-color-scheme` 样式或站点全局的 `<html class="dark">` 之类选择器联动的
// 自定义样式覆盖来实现，无需 JS 转发。因此本适配器不导出 onThemeChange，
// 详见《使用规则.md》第 4.2 节「如果评论组件不支持主题，直接不导出该函数即可」。
