export interface ReadingStats {
    wordsEN: number
    charsCJK: number
    estimatedChars: number // 用于展示的“字数”估算
    minutes: number // 向上取整后的分钟数
}

// 粗略移除 Markdown 语法标记
function stripMarkdown(src: string): string {
    return (
        src
            // frontmatter
            .replace(/^---[\s\S]*?---\s*/, '')
            // 代码块
            .replace(/```[^\n]*\n?([\s\S]*?)```/g, '$1')
            // 行内代码
            .replace(/`([^`]*)`/g, '$1')
            // 图片与链接
            .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
            // 标题/列表标记
            .replace(/^\s{0,3}#{1,6}\s+/gm, '')
            .replace(/^\s{0,3}>\s?/gm, '')
            .replace(/^\s*[-+*]\s+/gm, '')
            .replace(/^\s*\d+\.\s+/gm, '')
            .replace(/^\s*([-*_])(?:\s*\1){2,}\s*$/gm, ' ')
            // 粗体/斜体/删除线
            .replace(/(\*\*|__)(.*?)\1/g, '$2')
            .replace(/(\*|_)(.*?)\1/g, '$2')
            .replace(/~~(.*?)~~/g, '$1')
            // HTML 标签
            .replace(/<[^>]+>/g, ' ')
            // 转义符
            .replace(/\\/g, '')
            // 合并空白
            .replace(/\s+/g, ' ')
            .trim()
    )
}

export function analyzeReading(raw: string | undefined): ReadingStats {
    if (!raw) {
        return {
            wordsEN: 0,
            charsCJK: 0,
            estimatedChars: 0,
            minutes: 1,
        }
    }

    const text = stripMarkdown(raw || '')

    const enWords = text.match(/[A-Za-z]+/g) ?? []
    const wordsEN = enWords.length

    const cjkChars = text.match(/[\u4E00-\u9FFF]/g) ?? [] // 仅统计常用汉字区
    const charsCJK = cjkChars.length

    // 展示用“字数”：汉字按 1 字计，英语粗略按 5 字母≈1 个“字”的可读体量折算
    const estimatedChars = charsCJK + Math.round(wordsEN * 5)

    // 阅读时间估算：英语 ~180 wpm，中文 ~250 cpm（每分钟字符数）
    const minutesFloat = wordsEN / 180 + charsCJK / 250
    const minutes = Math.max(1, Math.ceil(minutesFloat))

    return { wordsEN, charsCJK, estimatedChars, minutes }
}
