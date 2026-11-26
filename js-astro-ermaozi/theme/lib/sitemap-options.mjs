// @ts-check

/** @typedef {{ sitemapFilename?: string, sitemapXSLFilename?: string, sitemapXSLTemplate?: string, devServer?: boolean }} SitemapOptions */

/** @param {unknown} value @param {string} fallback */
const outputFilename = (value, fallback) => {
  const filename = typeof value === 'string' ? value.replaceAll('\\', '/').replace(/^\/+/, '') : fallback
  return !filename || filename.split('/').includes('..') ? fallback : filename
}

/** @param {{ plugins?: { sitemap?: unknown } }} config @returns {false | SitemapOptions} */
export const sitemapOptions = config => config.plugins?.sitemap === false
  ? false
  : typeof config.plugins?.sitemap === 'object' && config.plugins.sitemap !== null ? /** @type {SitemapOptions} */ (config.plugins.sitemap) : {}

/** @param {{ plugins?: { sitemap?: unknown } }} config */
export const sitemapOutputNames = config => {
  const options = sitemapOptions(config)
  return {
    sitemap: outputFilename(options && options.sitemapFilename, 'sitemap.xml'),
    xsl: outputFilename(options && options.sitemapXSLFilename, 'sitemap.xsl'),
  }
}
