export type SearchablePage = { path: string, pathLocale: string, lang: string, title: string, filePathRelative?: string, frontmatter: Record<string, unknown>, data: Record<string, unknown>, content?: string }

export const isPageSearchable = (search: boolean | { isSearchable?: (page: SearchablePage) => boolean, [key: string]: unknown } | undefined, page: SearchablePage, pageEnabled = true) => pageEnabled
  && search !== false
  && (typeof search !== 'object' || search.isSearchable?.(page) !== false)
