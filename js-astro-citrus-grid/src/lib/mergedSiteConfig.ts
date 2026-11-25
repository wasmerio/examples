// 主题代码读取站点配置的统一入口。
// 用户可改的 src/site.config.ts 可能缺少后来新增的字段（旧版本升级场景），
// 这里先做保守兜底 + 告警，再以完整类型导出，保证构建与 astro check 都不因缺字段而失败。
// 校验（siteConfigGuard）仍在 site.config.ts 里调用，本模块不重复。
//
// 本模块会被 astro.config（Node 配置上下文）与 src 源码（Vite 上下文）共同加载，
// 因此内部一律用相对路径导入，不依赖 tsconfig paths。
import { siteConfig as rawSiteConfig } from '../site.config'
import type { SiteConfig } from './siteConfigDefaults'
import { applyMissingDefaults } from './siteConfigDefaults'

applyMissingDefaults(rawSiteConfig)

export const siteConfig: SiteConfig = rawSiteConfig

export type { FriendLinkRaw, MusicTrack, SiteConfig, SocialLink } from './siteConfigDefaults'
