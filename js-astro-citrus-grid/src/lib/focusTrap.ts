// 弹层焦点管理：
// - trapFocus：打开弹层时圈定 Tab 循环，release 时把焦点归还给打开前的元素；
//   初始焦点由调用方移到语义入口（如搜索输入框）
// - rememberFocus：仅记录/归还焦点，供不圈定 Tab 的小型对话框（如宠物卡片）使用

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export interface FocusTrap {
  release: () => void
}

// 记录调用时刻的焦点元素，返回归还函数；无焦点元素时归还函数为空操作
export function rememberFocus(): () => void {
  const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
  return () => opener?.focus({ preventScroll: true })
}

export function trapFocus(container: HTMLElement): FocusTrap {
  const restore = rememberFocus()

  // offsetParent 为 null 的是隐藏元素（如尚未出现的结果区按钮），不参与循环
  const focusables = () =>
    [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    )

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const items = focusables()
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    const inside = active instanceof Node && container.contains(active)
    if (e.shiftKey) {
      if (active === first || !inside) {
        e.preventDefault()
        last.focus({ preventScroll: true })
      }
      return
    }
    if (active === last || !inside) {
      e.preventDefault()
      first.focus({ preventScroll: true })
    }
  }
  container.addEventListener('keydown', onKeydown)

  return {
    release: () => {
      container.removeEventListener('keydown', onKeydown)
      restore()
    },
  }
}
