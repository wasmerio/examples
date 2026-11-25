interface SwupVisit {
  to: { url: string }
}

interface SwupLike {
  hooks: { on: (event: string, callback: (visit: SwupVisit) => void) => void }
}

const profileCardRoot = document.getElementById('profile-card-root')
let bound = false

const isHomePath = (path: string) => {
  const p = path.replace(/\/+$/, '') || '/'
  // 与 BaseLayout 的 isHomePage 一致：/404 命中纯数字正则但不是分页页
  return p !== '/404' && (p === '/' || /^\/\d+$/.test(p))
}

profileCardRoot?.addEventListener('animationend', () => {
  const root = profileCardRoot
  if (!root) return
  if (root.classList.contains('profile-card-leave')) root.hidden = true
  root.classList.remove('profile-card-leave', 'profile-card-enter', 'profile-card-hold')
})

export function bindProfileCardAnim(attempt = 0) {
  if (bound) return
  const swup = (window as unknown as { swup?: SwupLike }).swup
  if (swup?.hooks) {
    bound = true
    let pendingEnter = false
    swup.hooks.on('visit:start', (visit) => {
      if (!profileCardRoot) return
      try {
        const fromHome = isHomePath(window.location.pathname)
        const toHome = isHomePath(new URL(visit.to.url, window.location.href).pathname)
        profileCardRoot.classList.remove(
          'profile-card-leave',
          'profile-card-enter',
          'profile-card-hold',
        )
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (fromHome === toHome) {
          pendingEnter = false
          profileCardRoot.hidden = !toHome
        } else if (toHome) {
          pendingEnter = true
        } else {
          pendingEnter = false
          if (reduce) profileCardRoot.hidden = true
          else profileCardRoot.classList.add('profile-card-leave')
        }
      } catch {}
    })
    swup.hooks.on('content:replace', () => {
      if (!pendingEnter || !profileCardRoot) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      profileCardRoot.hidden = false
      profileCardRoot.classList.add('profile-card-hold')
    })
    swup.hooks.on('animation:in:start', () => {
      if (!pendingEnter || !profileCardRoot) return
      pendingEnter = false
      profileCardRoot.hidden = false
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        profileCardRoot.classList.remove('profile-card-hold')
        profileCardRoot.classList.add('profile-card-enter')
      }
    })
    swup.hooks.on('page:view', () => {
      if (!profileCardRoot) return
      profileCardRoot.hidden = !isHomePath(window.location.pathname)
    })
    swup.hooks.on('visit:end', () => {
      if (!profileCardRoot) return
      pendingEnter = false
      profileCardRoot.hidden = !isHomePath(window.location.pathname)
      profileCardRoot.classList.remove(
        'profile-card-leave',
        'profile-card-enter',
        'profile-card-hold',
      )
    })
    return
  }

  if (attempt === 0) {
    document.addEventListener('swup:enable', () => bindProfileCardAnim(0), { once: true })
  }
  if (attempt < 20) {
    window.setTimeout(() => bindProfileCardAnim(attempt + 1), 100)
  }
}
