// 此脚本用于在未提供 description 的 frontmatter 时，
// 自动文章的提取前 90 字作为 description

import { siteConfig } from '@/config'

export function genDescription(raw: string | undefined): string {
    const maxLength = siteConfig.articles.summaryLength || 90

    // 如果 undefined 直接返回 ''
    if (!raw) return ''

    // 干掉 frontmatter
    const prePlain = raw.replace(/^---[\s\S]*?---\s*/, '')
    // 干掉 md 标记符号
    const plain = prePlain
        .replace(/```[^\n]*\n?([\s\S]*?)```/g, '$1')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/<[^>]*>/g, ' ')
        .replace(/^\s{0,3}#{1,6}\s+/gm, '')
        .replace(/^\s{0,3}>\s?/gm, '')
        .replace(/^\s*[-+*]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/^\s*([-*_])(?:\s*\1){2,}\s*$/gm, ' ')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/\\/g, '')
        .replace(/\s+/g, ' ')
        .trim()

    return plain.slice(0, maxLength)
}
