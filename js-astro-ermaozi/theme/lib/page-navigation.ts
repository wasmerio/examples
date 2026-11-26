const headSelectors = [
  '[data-ermaozi-managed-head]',
  'link[rel="canonical"]',
  'link[rel="alternate"]',
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[name="keywords"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
]

const syncHead = (nextDocument: Document) => {
  document.title = nextDocument.title
  const selector = headSelectors.join(',')
  document.head.querySelectorAll(selector).forEach(item => item.remove())
  nextDocument.head.querySelectorAll(selector).forEach(item => {
    const clone = item.cloneNode(true)
    document.head.append(clone)
    if (clone instanceof HTMLScriptElement) executeScript(clone)
  })
  const pageData = nextDocument.querySelector('#ermaozi-page-data')
  const currentPageData = document.querySelector('#ermaozi-page-data')
  if (pageData && currentPageData) currentPageData.textContent = pageData.textContent
  const currentTranslations = document.querySelectorAll('.translations a[hreflang]')
  const nextTranslations = nextDocument.querySelectorAll('.translations a[hreflang]')
  currentTranslations.forEach((link, index) => {
    const next = nextTranslations[index]
    if (!(link instanceof HTMLAnchorElement) || !(next instanceof HTMLAnchorElement)) return
    link.href = next.href
    link.lang = next.lang
    link.hreflang = next.hreflang
  })
}

const executeScript = (script: HTMLScriptElement) => {
  const replacement = document.createElement('script')
  for (const attribute of script.attributes) replacement.setAttribute(attribute.name, attribute.value)
  replacement.textContent = script.textContent
  script.replaceWith(replacement)
}

const executeScripts = (root: ParentNode) => root.querySelectorAll('script').forEach(executeScript)

const postsRoutes = () => {
  const posts = document.querySelector<HTMLElement>('[vp-posts]')
  if (!posts) return new Set<string>()
  return new Set([
    posts.dataset.postsRoute,
    ...[...document.querySelectorAll<HTMLAnchorElement>('.vp-posts-nav a[href], .posts-modal .nav-link[href]')].map(link => link.pathname),
  ].filter((route): route is string => Boolean(route)).map(route => new URL(route, location.href).pathname))
}

const syncNavbar = (nextDocument: Document) => {
  const selector = '.vp-navbar-menu-group, .vp-navbar-menu a, .vp-nav-screen-menu a'
  const currentItems = document.querySelectorAll<HTMLElement>(selector)
  const nextItems = nextDocument.querySelectorAll<HTMLElement>(selector)
  if (currentItems.length !== nextItems.length) return
  currentItems.forEach((item, index) => item.classList.toggle('active', nextItems[index].classList.contains('active')))
}

export function initPageNavigation() {
  if ((globalThis as typeof globalThis & { __ERMAOZI_PAGE_NAVIGATION__?: boolean }).__ERMAOZI_PAGE_NAVIGATION__) return
  ;(globalThis as typeof globalThis & { __ERMAOZI_PAGE_NAVIGATION__?: boolean }).__ERMAOZI_PAGE_NAVIGATION__ = true

  let currentPath = location.pathname
  let navigation: AbortController | undefined

  const syncSidebar = (url: URL) => {
    const sidebar = document.querySelector('.vp-sidebar')
    sidebar?.querySelectorAll('.vp-sidebar-item').forEach(item => item.classList.remove('is-active', 'has-active'))
    sidebar?.querySelectorAll('a[aria-current]').forEach(link => link.removeAttribute('aria-current'))
    const active = [...sidebar?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []].find(link => {
      const href = new URL(link.href, location.href)
      return href.pathname === url.pathname && href.search === url.search
    })
    if (!active) return
    active.setAttribute('aria-current', 'page')
    let item = active.closest('.vp-sidebar-item')
    item?.classList.add('is-active')
    while (item) {
      item.classList.add('has-active')
      item.classList.remove('collapsed')
      const wrapper = item.querySelector<HTMLElement>(':scope > .items-wrapper')
      const caret = item.querySelector(':scope > .item .caret')
      if (wrapper) wrapper.hidden = false
      caret?.setAttribute('aria-expanded', 'true')
      item = item.parentElement?.closest('.vp-sidebar-item') ?? null
    }
    active.scrollIntoView({ block: 'nearest' })
  }

  const navigate = async (url: URL, mode: 'docs' | 'posts', push = true) => {
    navigation?.abort()
    navigation = new AbortController()
    const currentContent = document.querySelector<HTMLElement>('#VPContent')
    if (!currentContent) return location.assign(url.href)
    currentContent.setAttribute('aria-busy', 'true')
    document.dispatchEvent(new CustomEvent('plume-navigation-start'))
    try {
      const response = await fetch(url, { signal: navigation.signal, headers: { Accept: 'text/html' } })
      if (!response.ok) throw new Error(`Navigation failed: ${response.status}`)
      const nextDocument = new DOMParser().parseFromString(await response.text(), 'text/html')
      const nextContent = nextDocument.querySelector<HTMLElement>('#VPContent')
      if (!nextContent || mode === 'docs' && !nextDocument.querySelector('.vp-sidebar') || mode === 'posts' && !nextContent.querySelector('[vp-posts]')) throw new Error(`Not a ${mode} page`)
      const currentSidebar = document.querySelector<HTMLElement>('.vp-sidebar')
      const nextSidebar = nextDocument.querySelector<HTMLElement>('.vp-sidebar')
      if (nextDocument.body.dataset.pageShell !== document.body.dataset.pageShell
        || mode === 'docs' && nextSidebar?.dataset.sidebarSignature !== currentSidebar?.dataset.sidebarSignature) return location.assign(url.href)
      const imported = document.importNode(nextContent, true)
      const persistedAside = mode === 'posts' ? currentContent.querySelector('.vp-posts-aside') : null
      const nextAside = mode === 'posts' ? imported.querySelector('.vp-posts-aside') : null
      if (persistedAside && nextAside) nextAside.replaceWith(persistedAside)
      if (push) history.pushState(mode === 'docs' ? { ermaoziDoc: true } : { ermaoziPosts: true }, '', url)
      currentPath = url.pathname
      syncHead(nextDocument)
      currentContent.replaceWith(imported)
      syncNavbar(nextDocument)
      if (mode === 'docs') syncSidebar(url)
      else {
        persistedAside?.querySelectorAll<HTMLAnchorElement>('.vp-posts-nav .nav-link').forEach(link => link.classList.toggle('active', link.pathname === url.pathname))
      }
      document.body.style.overflow = ''
      scrollTo({ top: 0, left: 0 })
      executeScripts(imported)
      document.dispatchEvent(new CustomEvent('plume-content-updated'))
      if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView()
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      location.assign(url.href)
    } finally {
      document.querySelector('#VPContent')?.removeAttribute('aria-busy')
      document.dispatchEvent(new CustomEvent('plume-navigation-end'))
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null
    if (!(link instanceof HTMLAnchorElement) || link.target && link.target !== '_self' || link.hasAttribute('download')) return
    const next = new URL(link.href, location.href)
    if (next.origin !== location.origin || next.pathname === location.pathname && next.search === location.search) return
    const mode = link.closest('.vp-sidebar') ? 'docs' : postsRoutes().has(next.pathname) ? 'posts' : null
    if (!mode) return
    event.preventDefault()
    void navigate(next, mode)
  }, { capture: true })

  history.scrollRestoration = 'manual'
  addEventListener('popstate', () => {
    const next = new URL(location.href)
    if (next.pathname === currentPath) return
    const sidebar = document.querySelector('.vp-sidebar')
    if (sidebar?.querySelector(`a[href="${CSS.escape(next.pathname)}"], a[href="${CSS.escape(`${next.pathname}${next.search}`)}"]`)) void navigate(next, 'docs', false)
    else if (postsRoutes().has(next.pathname)) void navigate(next, 'posts', false)
    else location.reload()
  })
}
