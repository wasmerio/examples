export type CopyrightOptions = {
  author?: string | { name: string, url?: string }
  creation?: 'original' | 'translate' | 'reprint'
  source?: string
  license?: string | { name: string, url?: string }
}

export type CopyrightSetting = boolean | string | CopyrightOptions | undefined

function normalizeTheme(setting: CopyrightSetting | (CopyrightOptions & { enabled?: boolean })): CopyrightSetting {
  if (!setting || typeof setting !== 'object' || !('enabled' in setting)) return setting
  const { enabled, ...options } = setting
  return enabled === false ? false : options
}

export function resolveCopyrightOptions(
  frontmatter: CopyrightSetting,
  configured: CopyrightSetting | (CopyrightOptions & { enabled?: boolean }),
): CopyrightOptions | undefined {
  const theme = normalizeTheme(configured)
  if ((frontmatter ?? theme ?? false) === false) return undefined

  const page: CopyrightOptions = typeof frontmatter === 'object'
    ? { ...frontmatter }
    : { license: frontmatter === true ? '' : typeof frontmatter === 'string' ? frontmatter : undefined }
  if (!theme) return page

  const defaults: CopyrightOptions = typeof theme === 'object'
    ? theme
    : { license: theme === true ? undefined : theme }
  page.license ??= defaults.license
  page.author ??= defaults.author
  page.creation ??= defaults.creation
  return page
}
