/**
  Utterances 评论适配器，基于 https://utteranc.es ：
  借用 GitHub Issues 存储评论，评论者需授权 GitHub App 登录后发言。

  启用方式：site.config.ts 设置 `commentScript: utterances`，并在下方配置区填写 repo。
  适配器契约详见同目录《使用规则.md》。
 */

// ========== 配置区：使用前在这里填写你的 utterances 设置 ==========
const config = {
  // 必填：接收评论的公开 GitHub 仓库，格式 '用户名/仓库名'（需在该仓库安装 utterances App）。
  // 留空则评论区停用（控制台会提示）。
  repo: '',
  // 评论与页面的映射方式：'pathname'（推荐，按页面路径建 Issue）、'url'、'title' 等
  issueTerm: 'pathname',
  // 可选：为自动创建的 Issue 打标签（标签需已存在于仓库），留空不打
  label: '',
  // 明 / 暗两套主题，可选值见 https://utteranc.es 的 theme
  lightTheme: 'github-light',
  darkTheme: 'github-dark',
}
// =================================================================

const UTTERANCES_ORIGIN = 'https://utteranc.es'

const utterancesTheme = (dark: boolean) => (dark ? config.darkTheme : config.lightTheme)

const isDark = () => document.documentElement.classList.contains('dark')

// 挂载评论（契约必选）：向容器注入 utterances 引导脚本（async），iframe 由其自行渲染
export function mountComment(container: HTMLElement): void {
  if (!config.repo) {
    throw new Error(
      '[comments] utterances.repo 未配置，请编辑 src/comments/utterances.ts 填写 repo',
    )
  }
  const script = document.createElement('script')
  script.src = `${UTTERANCES_ORIGIN}/client.js`
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('repo', config.repo)
  script.setAttribute('issue-term', config.issueTerm)
  if (config.label) script.setAttribute('label', config.label)
  script.setAttribute('theme', utterancesTheme(isDark()))
  container.appendChild(script)
}

// 主题切换（契约可选）：跟随全局 theme-change 事件，把新主题同步进已渲染的 utterances iframe
export function onThemeChange(dark: boolean): void {
  document.querySelectorAll<HTMLIFrameElement>('.utterances iframe').forEach((iframe) => {
    iframe.contentWindow?.postMessage(
      { type: 'set-theme', theme: utterancesTheme(dark) },
      UTTERANCES_ORIGIN,
    )
  })
}
