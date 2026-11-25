const REQUIRED_TRACK_FIELDS = ['title', 'src'] as const

export interface ValidatableSiteConfig {
  postsPerPage?: unknown
  musicPlayer?: { enabled?: unknown; playlist?: unknown } | null
  pet?: { enabled?: unknown } | null
  relatedPosts?: { enabled?: unknown } | null
  backlinks?: { enabled?: unknown } | null
}

export function validateSiteConfig(config: ValidatableSiteConfig): void {
  // `nav` / `defaultLang` 的缺失与非法取值由 lib/siteConfigDefaults.ts 兜底归一，这里不再校验。

  validatePostsPerPage(config.postsPerPage)
  validatePet(config)
  validateMusicPlayer(config)
  validateToggle(config.relatedPosts?.enabled, 'relatedPosts.enabled')
  validateToggle(config.backlinks?.enabled, 'backlinks.enabled')
}

function validatePostsPerPage(value: unknown): void {
  if (value === undefined) return
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1) return
  // 中文：`postsPerPage` 必须是正整数，否则分页数会变成 Infinity 或 paginate 直接报错。
  console.warn(
    '[site.config] `postsPerPage` must be a positive integer; pagination breaks otherwise.',
  )
}

function validateToggle(value: unknown, path: string): void {
  if (value === undefined || typeof value === 'boolean') return
  console.warn(
    `[site.config] \`${path}\` must be a boolean; the default (enabled) is used instead.`,
  )
}

function validatePet(config: ValidatableSiteConfig): void {
  const pet = config.pet
  // 节点整体缺失视为未使用该组件，与 musicPlayer 等可选项一致，不告警；
  // 节点存在但 enabled 不是布尔值才提示（此时宠物按关闭处理）
  if (!pet) return
  if (typeof pet.enabled === 'boolean') return
  // 中文：`pet.enabled` 必须是布尔值，缺失或其它取值会让左下角宠物按关闭处理。
  console.warn(
    '[site.config] `pet.enabled` must be a boolean; the pet widget is treated as disabled.',
  )
}

function validateMusicPlayer(config: ValidatableSiteConfig): void {
  const player = config.musicPlayer
  if (!player?.enabled) return

  if (!Array.isArray(player.playlist)) {
    // 中文：`musicPlayer.playlist` 必须是数组。
    console.warn('[site.config] `musicPlayer.playlist` must be an array.')
    return
  }

  const playlist = player.playlist as unknown[]
  playlist.forEach((track, i) => {
    const record = track as Record<string, unknown> | null
    const missing = REQUIRED_TRACK_FIELDS.filter((key) => !record?.[key])
    if (missing.length === 0) return
    // 中文：`musicPlayer.playlist[i]` 缺少必需字段：title / src。
    console.warn(
      `[site.config] \`musicPlayer.playlist[${i}]\` is missing required field(s): ${missing.join(' / ')}.`,
    )
  })
}
