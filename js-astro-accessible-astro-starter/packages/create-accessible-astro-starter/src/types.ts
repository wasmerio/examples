export const PRESETS = ['full', 'blog', 'portfolio', 'minimal', 'barebones'] as const

export type Preset = (typeof PRESETS)[number]

export type ParsedFlags = {
  targetDir?: string
  siteName?: string
  preset?: Preset
  includeLauncher?: boolean
  yes: boolean
}

export type ResolvedOptions = {
  targetDir: string
  siteName: string
  siteId: string
  preset: Preset
  includeLauncher: boolean
}

export type ProjectManifest = {
  preset: Preset
  includeLauncher: boolean
  keepBlog: boolean
  keepPortfolio: boolean
  keepDemoPages: boolean
  keepAboutPage: boolean
  keepContactPage: boolean
  keepThankYouPage: boolean
  keepMdx: boolean
  keepBlogEnv: boolean
  keepContentCollection: boolean
  usePageHeader: boolean
  pathsToDelete: string[]
}
