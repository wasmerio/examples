/**
 * 此脚本用于在 /posts 过滤不同标签的文章
 */
const applypostTagFilter = () => {
    const pathname = window.location.pathname.replace(/\/$/, '')
    if (pathname !== '/posts') return

    const items = Array.from(document.querySelectorAll<HTMLElement>('.r-item[data-tags]'))
    if (items.length === 0) return

    const years = Array.from(document.querySelectorAll<HTMLElement>('.r-year'))
    const count = document.querySelector<HTMLElement>('#post-count')
    const empty = document.querySelector<HTMLElement>('#post-empty')
    const params = new URLSearchParams(window.location.search)
    // 从 URL 参数获取当前标签
    const currentTag = params.get('tag')?.trim().toLowerCase()
    const currentCategory = params.get('category')?.trim().toLowerCase()
    // 如果没有筛选参数，显示全部
    if (!currentTag && !currentCategory) {
        items.forEach((i) => i.classList.remove('r-hidden'))
        years.forEach((y) => y.classList.remove('r-hidden'))
        if (count) count.textContent = String(items.length)
        if (empty) empty.classList.add('r-hidden')
        return
    }

    let visibleCount = 0

    for (const item of items) {
        const tags = (item.getAttribute('data-tags') || '')
            .split(',')
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean)
        const category = (item.getAttribute('data-category') || '').trim().toLowerCase()

        const matchedTag = !currentTag || tags.includes(currentTag)
        const matchedCategory = !currentCategory || category === currentCategory
        const matched = matchedTag && matchedCategory
        item.classList.toggle('r-hidden', !matched)
        if (matched) visibleCount += 1
    }
    // 注：根据可见的文章数量，决定年份标题的显示
    for (const year of years) {
        const hasVisible = year.querySelector('.r-item:not(.r-hidden)')
        year.classList.toggle('r-hidden', !hasVisible)
    }

    if (count) count.textContent = String(visibleCount)
    if (empty) empty.classList.toggle('r-hidden', visibleCount !== 0)
}

document.addEventListener('astro:page-load', applypostTagFilter)
