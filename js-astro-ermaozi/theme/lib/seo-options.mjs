// @ts-check

/** @param {{ plugins?: { seo?: unknown } }} config @param {unknown} page */
export const seoEnabled = (config, page = true) => config.plugins?.seo !== false && page !== false
