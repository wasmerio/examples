/**
 * @param {string} source
 * @param {{ siteName: string, siteDescription: string, multilingual: boolean, defaultLanguage?: 'zh-CN' | 'en-US' }} answers
 */
export const configureSiteConfig = (source, { siteName, siteDescription, multilingual, defaultLanguage = 'zh-CN' }) => {
  const multilingualPattern = /^(\s*multilingual:\s*)(?:true|false),$/m
  if (!multilingualPattern.test(source)) throw new Error('无法更新 site.config.mjs 中的 multilingual')
  let configured = source.replace(
    multilingualPattern,
    (/** @type {string} */ _, /** @type {string} */ prefix) => `${prefix}${multilingual},`,
  )

  let siteNameCount = 0
  configured = configured.replace(/^(\s*siteName:\s*).+,$/gm, (/** @type {string} */ _, /** @type {string} */ prefix) => {
    siteNameCount += 1
    return `${prefix}${JSON.stringify(siteName)},`
  })
  if (siteNameCount < 2) throw new Error('无法更新 site.config.mjs 中的 siteName')

  const chineseStart = configured.indexOf("    'zh-CN': {")
  const englishStart = configured.indexOf("    'en-US': {", chineseStart)
  if (chineseStart < 0 || englishStart < 0) throw new Error('无法定位 site.config.mjs 的默认语言配置')
  let chinese = configured.slice(chineseStart, englishStart)
  let english = configured.slice(englishStart)
  if (defaultLanguage === 'en-US') {
    chinese = chinese
      .replace(/(['"])(\/(?!\/)[^'"\n]*)\1/g, (match, quote, route) => /^\/(?:img|assets?)\//.test(route) ? match : `${quote}/zh${route}${quote}`)
      .replace(/(['"])\^\//g, '$1^/zh/')
    english = english
      .replace(/(['"])\/en(\/[^'"\n]*)\1/g, '$1$2$1')
      .replace(/(['"])\^\/en\//g, '$1^/')
  }

  const locale = defaultLanguage === 'en-US' ? english : chinese
  const descriptionPattern = /^(\s*description:\s*).+,$/m
  if (!descriptionPattern.test(locale)) throw new Error('无法更新 site.config.mjs 中的 description')
  const described = locale.replace(descriptionPattern, (/** @type {string} */ _, /** @type {string} */ prefix) => `${prefix}${JSON.stringify(siteDescription)},`)
  if (defaultLanguage === 'en-US') english = described
  else chinese = described
  const result = `${configured.slice(0, chineseStart)}${chinese}${english}`
  return defaultLanguage === 'en-US'
    ? result
        .replace('已存在的 /en/ 示例页仍可直接访问', '已存在的 /zh/ 示例页仍可直接访问')
        .replace('英文 locale 保留给 content/en/ 示例内容使用；字段含义与上方中文块相同。', '英文 locale 是当前根语言，对应 content/；中文示例位于 content/zh/。')
        .replace("如需将英文首页改到 /en/blog/，应同时保留 path: '/en/' 作为语言路径前缀。", "如需将英文首页改到 /blog/，应同时保留 path: '/' 作为语言路径前缀。")
    : result
}
