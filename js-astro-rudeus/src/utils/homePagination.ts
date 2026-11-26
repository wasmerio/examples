/*
 * 此脚本用于计算首页分页相关内容
 * @author crrashh1542
 * @version 1.0
 */

import { siteConfig } from '@/config'
// 每页的文章数量
const pageLimit = siteConfig.articles.indexPerPage || 8

interface NavPageItem {
    type: 'page'
    page: number
    href: string
    isCurrent: boolean
}
interface NavEllipsisItem {
    type: 'ellipsis'
    key: string
}
export type NavItem = NavPageItem | NavEllipsisItem

// 总页数
export const getHomeTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / pageLimit)
}

// 获取当前页的文章列表
export const getHomePageItems = <T>(items: T[], page: number) => {
    const safePage = Math.max(page, 1)
    const start = (safePage - 1) * pageLimit
    return items.slice(start, start + pageLimit)
}

// 获取页码列表
export const getHomeIndexPages = (totalItems: number) => {
    const totalPages = getHomeTotalPages(totalItems)
    return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => String(i + 2))
}

// 获取分页导航项
export const getHomePageNavItems = (currentPage: number, totalPages: number): NavItem[] => {
    if (totalPages <= 1) {
        return []
    }

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1
            return {
                type: 'page',
                page,
                href: page === 1 ? '/' : `/${page}`,
                isCurrent: page === currentPage,
            }
        })
    }

    const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
    const sortedPages = Array.from(pages)
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b)

    const result: NavItem[] = []
    let previousPage = 0

    // 插入页码，省略号
    sortedPages.forEach((page) => {
        if (previousPage > 0) {
            const gap = page - previousPage
            if (gap === 2) {
                const middlePage = previousPage + 1
                result.push({
                    type: 'page',
                    page: middlePage,
                    href: middlePage === 1 ? '/' : `/${middlePage}`,
                    isCurrent: middlePage === currentPage,
                })
            } else if (gap > 2) {
                result.push({
                    type: 'ellipsis',
                    key: `${previousPage}-${page}`,
                })
            }
        }

        result.push({
            type: 'page',
            page,
            href: page === 1 ? '/' : `/${page}`,
            isCurrent: page === currentPage,
        })
        previousPage = page
    })

    return result
}
