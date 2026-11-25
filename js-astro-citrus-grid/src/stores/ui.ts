export type SortBy = 'name' | 'count'

function sortSetting(key: string) {
  return {
    get(): SortBy {
      if (typeof localStorage === 'undefined') return 'count'
      return localStorage.getItem(key) === 'name' ? 'name' : 'count'
    },
    set(value: SortBy) {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value)
    },
  }
}

// 分类页排序，默认按数量
export const categoriesSort = sortSetting('categoriesSort')

// 标签页排序，默认按数量
export const tagsSort = sortSetting('tagsSort')
