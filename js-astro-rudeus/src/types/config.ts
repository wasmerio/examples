// src/config.ts 站点配置类型定义

export type SiteConfig = {
    title: string
    subtitle: string
    description: string
    url: string
    isWithExt?: boolean
    isWithLoadingBar?: boolean
    license: {
        enabled: boolean
        name?: string
        url?: string
        prompt?: string
    }
    articles: {
        indexPerPage?: number
        descriptionLength?: number
    }
    background: {
        enabled: boolean
        url?: {
            light?: string
            dark?: string
        }
        opacity?: number
    }
}

export type NavConfig = Array<{
    name: string
    url: string
}>

export type ProfileConfig = {
    name: string
    avatar: string
    description: string
}

export type FooterConfig = {
    copyright?: string
    message?: string
}
