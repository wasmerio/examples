import type { ProjectManifest, ResolvedOptions } from './types.js'
import { escapeForHtml, escapeForSingleQuotedString, formatPresetLabel } from './utils.js'

type ThemeNavItem =
  | {
      type?: 'link'
      label: string
      href: string
    }
  | {
      type: 'dropdown'
      label: string
      items: Array<{
        label: string
        href: string
      }>
    }

function indent(value: string, spaces: number): string {
  const prefix = ' '.repeat(spaces)
  return value
    .split('\n')
    .map((line) => (line.length > 0 ? `${prefix}${line}` : line))
    .join('\n')
}

function buildThemeNavigation(manifest: ProjectManifest): ThemeNavItem[] {
  if (manifest.preset === 'full') {
    return [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'Blog',
        href: '/blog',
      },
      {
        label: 'Portfolio',
        href: '/portfolio',
      },
      {
        type: 'dropdown',
        label: 'Features',
        items: [
          {
            label: 'Accessibility statement',
            href: '/accessibility-statement',
          },
          {
            label: 'Accessible components',
            href: '/accessible-components',
          },
          ...(manifest.includeLauncher
            ? [
                {
                  label: 'Accessible launcher',
                  href: '/accessible-launcher',
                },
              ]
            : []),
          {
            label: 'Color contrast checker',
            href: '/color-contrast-checker',
          },
          {
            label: 'Markdown page',
            href: '/markdown-page',
          },
          {
            label: 'MDX page',
            href: '/mdx-page',
          },
          {
            label: 'Sitemap',
            href: '/sitemap',
          },
        ],
      },
      {
        label: 'Contact',
        href: '/contact',
      },
    ]
  }

  if (manifest.preset === 'blog') {
    return [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'Blog',
        href: '/blog',
      },
      {
        label: 'Contact',
        href: '/contact',
      },
    ]
  }

  if (manifest.preset === 'portfolio') {
    return [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'Portfolio',
        href: '/portfolio',
      },
      {
        label: 'Contact',
        href: '/contact',
      },
    ]
  }

  if (manifest.preset === 'minimal') {
    return [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'About',
        href: '/about',
      },
      {
        label: 'Contact',
        href: '/contact',
      },
    ]
  }

  return [
    {
      label: 'Home',
      href: '/',
    },
  ]
}

function renderThemeNavigationItem(item: ThemeNavItem): string {
  if (item.type === 'dropdown') {
    const childItems = item.items
      .map(
        (childItem) => `{
            label: '${escapeForSingleQuotedString(childItem.label)}',
            href: '${escapeForSingleQuotedString(childItem.href)}',
          }`,
      )
      .join(',\n')

    return `{
        type: 'dropdown',
        label: '${escapeForSingleQuotedString(item.label)}',
        items: [
${indent(childItems, 10)}
        ],
      }`
  }

  return `{
        type: 'link',
        label: '${escapeForSingleQuotedString(item.label)}',
        href: '${escapeForSingleQuotedString(item.href)}',
      }`
}

function createFeatureCards(cards: Array<{ title: string; body: string }>): string {
  return cards
    .map(
      (card) => `<div class="rounded-xl border border-(--border-color-subtle) p-6">
        <Heading level="h2" size="h5">${card.title}</Heading>
        <p class="mt-3">${card.body}</p>
      </div>`,
    )
    .join('\n')
}

function createPresetDescription(siteName: string, manifest: ProjectManifest): string {
  const name = escapeForSingleQuotedString(siteName)

  switch (manifest.preset) {
    case 'blog':
      return `${name} is set up as an accessible content site with a blog and contact flow.`
    case 'portfolio':
      return `${name} is set up as an accessible portfolio with project pages and a contact flow.`
    case 'minimal':
      return `${name} is a lightweight accessible content site with room to grow.`
    case 'barebones':
      return `${name} is a stripped-back accessible Astro foundation.`
    case 'full':
    default:
      return `${name} is an accessible Astro site with blog, portfolio, and demo pages ready to customize.`
  }
}

export function createAstroConfig(manifest: ProjectManifest): string {
  const imports = [
    "import { defineConfig, envField } from 'astro/config'",
    "import { fileURLToPath } from 'url'",
    "import compress from 'astro-compress'",
    "import icon from 'astro-icon'",
    ...(manifest.keepMdx ? ["import mdx from '@astrojs/mdx'"] : []),
    "import sitemap from '@astrojs/sitemap'",
    "import tailwindcss from '@tailwindcss/vite'",
  ]

  const integrations = ['compress()', 'icon()', ...(manifest.keepMdx ? ['mdx()'] : []), 'sitemap()']

  const envBlock = manifest.keepBlogEnv
    ? `  env: {
    schema: {
      BLOG_API_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'https://jsonplaceholder.typicode.com/posts',
      }),
    },
  },`
    : ''

  return `${imports.join('\n')}

const viteConfig = {
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [fileURLToPath(new URL('./src/assets', import.meta.url))],
        logger: {
          warn: () => {},
        },
      },
    },
  },
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@public': fileURLToPath(new URL('./public', import.meta.url)),
      '@post-images': fileURLToPath(new URL('./public/posts', import.meta.url)),
      '@project-images': fileURLToPath(new URL('./public/projects', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@theme-config': fileURLToPath(new URL('./theme.config.ts', import.meta.url)),
    },
  },
}

export default defineConfig({
  compressHTML: true,
  site: 'https://example.com',
  integrations: [${integrations.join(', ')}],
  vite: viteConfig,
${envBlock}
})
`
}

export function createThemeConfig(options: ResolvedOptions, manifest: ProjectManifest): string {
  const navigationItems = buildThemeNavigation(manifest).map(renderThemeNavigationItem).join(',\n')
  const siteName = escapeForSingleQuotedString(options.siteName)
  const description = escapeForSingleQuotedString(createPresetDescription(options.siteName, manifest))

  return `import { defineThemeConfig } from '@utils/defineThemeConfig'
import previewImage from '@assets/img/social-preview-image.png'
import logoImage from '@assets/img/logo.svg'

export default defineThemeConfig({
  name: '${siteName}',
  id: '${options.siteId}',
  seo: {
    title: '${siteName}',
    description: '${description}',
    image: previewImage,
  },
  logo: logoImage,
  colors: {
    primary: '#d648ff',
    secondary: '#00d1b7',
    neutral: '#b9bec4',
    outline: '#ff4500',
  },
  navigation: {
    darkmode: true,
    items: [
${indent(navigationItems, 6)}
    ],
  },
  socials: [],
})
`
}

export function createHeader(includeLauncher: boolean): string {
  const imports = [
    "import Navigation from '@components/Navigation.astro'",
    ...(includeLauncher ? ["import LauncherConfig from '@components/LauncherConfig.astro'"] : []),
    `import { ${includeLauncher ? 'HighContrast, ReducedMotion, SkipLink' : 'SkipLink'} } from 'accessible-astro-components'`,
  ]

  const launcherMarkup = includeLauncher
    ? `
  <div hidden>
    <HighContrast />
    <ReducedMotion />
  </div>
  <Navigation />
  <LauncherConfig />`
    : `
  <Navigation />`

  return `---
${imports.join('\n')}
---

<header>
  <SkipLink />${launcherMarkup}
</header>

<style lang="scss" is:global>
  @use '../assets/scss/base/breakpoint' as *;

  header {
    li.type-icon {
      display: block;

      @include breakpoint('nav') {
        translate: 0 4px;
      }

      button {
        border: none;
        border-radius: 0;
      }

      svg {
        inline-size: 30px;
        block-size: 30px;
      }
    }

    li.type-icon ~ li.type-icon {
      @include breakpoint('nav') {
        margin-inline-start: calc(var(--space-2xs) * -1);
      }
    }

    li.desktop-launcher {
      display: none;
    }

    @include breakpoint('nav') {
      li.desktop-launcher {
        display: block;
      }
    }
  }
</style>
`
}

export function createNavigation(includeLauncher: boolean): string {
  return `---
import ResponsiveToggle from './ResponsiveToggle.astro'
import NavigationItems from './NavigationItems.astro'
import Logo from './Logo.astro'
${includeLauncher ? "import { LauncherTrigger } from 'accessible-astro-launcher'" : ''}
---

<div id="main-navigation" class="py-8">
  <div class="container">
    <Logo />
    <div class="wrapper">
      <nav class="desktop-menu" aria-label="Main navigation desktop">
        <NavigationItems />
      </nav>
      <ResponsiveToggle />
${includeLauncher ? `      <div class="mobile-launcher">
        <LauncherTrigger launcherId="site-launcher" iconOnly={true} gradientBorder={true} />
      </div>` : ''}
    </div>
    <nav class="mobile-menu" aria-label="Main navigation mobile">
      <NavigationItems />
    </nav>
  </div>
</div>

<script>
  document.addEventListener('astro:page-load', () => {
    const mainNav = document.querySelector('#main-navigation') as HTMLElement | null
    if (!mainNav) return

    const mainMenu = mainNav.querySelector('ul') as HTMLUListElement | null
    const dropdownMenus = [...document.querySelectorAll('.has-dropdown button')] as HTMLButtonElement[]

    const setActiveMenuItem = (): void => {
      const mobileDesktopMenus = mainNav.querySelectorAll('nav > ul')
      const currentPath = window.location.pathname.replace(/\\/+$/, '') || '/'

      mobileDesktopMenus.forEach((menu) => {
        const menuItems = [...menu.querySelectorAll('a[href]:not([rel*="external"])')] as HTMLAnchorElement[]

        menuItems.forEach((menuItem) => {
          const itemPath = menuItem.pathname.replace(/\\/+$/, '') || '/'
          const isHome = itemPath === '/'
          const isActive = isHome ? currentPath === '/' : currentPath === itemPath || currentPath.startsWith(itemPath + '/')

          if (isActive) {
            menuItem.classList.add('is-active')
            menuItem.setAttribute('aria-current', 'page')
          }
        })
      })
    }

    const isOutOfViewport = (element: Element): boolean => {
      const elementBounds = element.getBoundingClientRect()
      return elementBounds.right > (window.innerWidth || document.documentElement.clientWidth)
    }

    const openDropdownMenu = (dropdownMenu: HTMLButtonElement): void => {
      const dropdownList = dropdownMenu.parentNode?.querySelector('ul') as HTMLUListElement | null
      if (!dropdownList) return

      dropdownMenu.classList.add('show')
      dropdownMenu.setAttribute('aria-expanded', 'true')

      if (isOutOfViewport(dropdownList)) {
        dropdownList.style.left = 'auto'
      }
    }

    const closeDropdownMenu = (dropdownMenu: HTMLButtonElement): void => {
      dropdownMenu.classList.remove('show')
      dropdownMenu.setAttribute('aria-expanded', 'false')
    }

    const closeAllDropdownMenus = (): void => {
      for (let i = 0; i < dropdownMenus.length; i++) {
        closeDropdownMenu(dropdownMenus[i])
      }
    }

    const toggleDropdownMenu = (event: MouseEvent): void => {
      const target = event.target as HTMLButtonElement
      if (target.getAttribute('aria-expanded') === 'false') {
        closeAllDropdownMenus()
        openDropdownMenu(target)
      } else {
        closeDropdownMenu(target)
      }
    }

    mainMenu &&
      mainMenu.addEventListener('keydown', (event: KeyboardEvent) => {
        const element = event.target as Element
        const currentMenuItem = element.closest('li')
        const menuItems = [...mainMenu.querySelectorAll('.menu-item')] as HTMLLIElement[]
        const currentDropdownMenu = element.closest('.has-dropdown button') as HTMLButtonElement | null
        const currentDropdownMenuItem = element.closest('.has-dropdown li') as HTMLLIElement | null
        const currentIndex = currentMenuItem ? menuItems.findIndex((item) => item === currentMenuItem) : -1

        const key = event.key
        let targetItem: Element | null = null

        if (key === 'ArrowRight') {
          if (currentMenuItem && menuItems.indexOf(currentMenuItem as HTMLLIElement) === menuItems.length - 1) {
            targetItem = menuItems[0]
          } else if (currentMenuItem) {
            targetItem = menuItems[currentIndex + 1]
          }
        }

        if (key === 'ArrowLeft') {
          if (currentMenuItem && menuItems.indexOf(currentMenuItem as HTMLLIElement) === 0) {
            targetItem = menuItems[menuItems.length - 1]
          } else if (currentMenuItem) {
            targetItem = menuItems[currentIndex - 1]
          }
        }

        if (key === 'Escape') {
          targetItem = menuItems[0]
        }

        if (currentDropdownMenu) {
          const nextElement = currentDropdownMenu.nextElementSibling as Element | null
          if (nextElement) {
            const firstDropdownItem = nextElement.querySelector('li')

            if (key === 'ArrowDown') {
              event.preventDefault()
              openDropdownMenu(currentDropdownMenu)
              targetItem = firstDropdownItem
            }
          }

          if (key === 'Escape') {
            closeDropdownMenu(currentDropdownMenu)
          }
        }

        if (currentDropdownMenuItem) {
          const currentDropdownList = currentDropdownMenuItem.parentNode as Element | null
          if (currentDropdownList) {
            const dropdownMenuItems = [...currentDropdownList.querySelectorAll('li')] as HTMLLIElement[]
            const currentIndex = dropdownMenuItems.findIndex((item) => item === currentDropdownMenuItem)

            if (key === 'ArrowDown') {
              event.preventDefault()

              if (dropdownMenuItems.indexOf(currentDropdownMenuItem) === dropdownMenuItems.length - 1) {
                targetItem = dropdownMenuItems[0]
              } else {
                targetItem = dropdownMenuItems[currentIndex + 1]
              }
            }

            if (key === 'ArrowUp') {
              event.preventDefault()

              if (dropdownMenuItems.indexOf(currentDropdownMenuItem) === 0) {
                targetItem = dropdownMenuItems[dropdownMenuItems.length - 1]
              } else {
                targetItem = dropdownMenuItems[currentIndex - 1]
              }
            }

            if (key === 'Escape') {
              const currentDropdownMenu = currentDropdownList.previousElementSibling as HTMLButtonElement | null
              if (currentDropdownMenu) {
                targetItem = currentDropdownMenu.parentElement
                closeAllDropdownMenus()
              }
            }

            if (key === 'Tab') {
              const currentDropdownMenu = currentDropdownList.previousElementSibling as HTMLButtonElement | null
              if (currentDropdownMenu) {
                if (dropdownMenuItems.indexOf(currentDropdownMenuItem) === dropdownMenuItems.length - 1) {
                  closeDropdownMenu(currentDropdownMenu)
                }
              }
            }
          }
        }

        if (targetItem) {
          const focusableElement = targetItem.querySelector('a, button, input') as HTMLElement | null
          if (focusableElement) {
            focusableElement.focus()
          }
        }
      })

    dropdownMenus &&
      dropdownMenus.forEach((dropdownMenu) => {
        dropdownMenu.addEventListener('click', toggleDropdownMenu as EventListener)
      })

    setActiveMenuItem()
    window.addEventListener('click', (event: MouseEvent) => {
      const element = event.target as Element
      if (!element.hasAttribute('aria-haspopup') && !element.classList.contains('submenu-item')) {
        closeAllDropdownMenus()
      }
    })
  })
</script>

<style lang="scss" is:global>
  @use '../assets/scss/base/mixins' as *;
  @use '../assets/scss/base/breakpoint' as *;

  #main-navigation {
    > .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }

    .mobile-menu {
      display: none;

      &.show {
        display: block;
      }
    }

    .responsive-toggle {
      display: flex;
      align-items: center;
      gap: var(--space-2xs);
    }

${includeLauncher ? `    .mobile-launcher {
      display: flex;
    }
` : ''}    .desktop-menu {
      display: none;
    }

    @include breakpoint('nav') {
      .mobile-menu {
        display: none;
      }

      .responsive-toggle {
        display: none;
      }

${includeLauncher ? `      .mobile-launcher {
        display: none;
      }
` : ''}      .desktop-menu {
        display: block;
      }
    }

    .wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-m);
    }

    a,
    button {
      color: var(--foreground-color);
    }

    nav {
      > ul {
        display: flex;
        gap: var(--space-m);
        list-style-type: none;

        li {
          align-content: center;
        }

        a:hover,
        a:focus-visible,
        .is-active,
        button[aria-expanded='true'],
        .has-dropdown > button:hover,
        .has-dropdown > button:focus-visible {
          text-decoration: underline;
          text-decoration-style: wavy;
          text-decoration-thickness: 1px;
          text-underline-offset: 7px;
        }

        .is-active {
          font-weight: bold;
        }
      }
    }

    .mobile-menu {
      flex-basis: 100%;
      margin-block-start: var(--space-m);
      border: 1px solid var(--border-color-subtle);
      border-radius: var(--radius-l);
      padding: var(--space-m);

      > ul {
        flex-direction: column;
        align-items: flex-start;

        ul {
          position: relative;
          margin-block-start: var(--space-m);
        }
      }

      a,
      button {
        display: block;
        padding: var(--space-2xs) 0;
        inline-size: 100%;
      }
    }

    .has-dropdown {
      position: relative;

      > button {
        display: flex;
        align-items: center;
        gap: var(--space-4xs);
        margin-block-start: -1px;

        svg {
          transition: all var(--animation-speed-instant) var(--cubic-bezier);
        }

        &.show {
          svg {
            scale: -1;
          }
        }
      }

      ul {
        display: none;
        position: absolute;
        flex-direction: column;
        gap: var(--space-2xs);
        translate: 0 1rem;
        opacity: 0;
        z-index: 100;
        inset-block-start: 125%;
        inset-inline-end: 0;
        inset-inline-start: 0;
        box-shadow: var(--elevation-4);
        background: var(--background-color);
        border: 2px solid var(--border-color-subtle);
        border-radius: var(--radius-l);
        padding: var(--space-m);
        min-inline-size: 275px;

        @media (prefers-reduced-motion: no-preference) {
          transition-behavior: allow-discrete;
          transition-duration: var(--animation-speed-fast);
          transition-property: display, opacity, translate;
          transition-timing-function: var(--cubic-bezier);
        }
      }

      > button.show ~ ul {
        display: flex;
        translate: 0;
        opacity: 1;

        @starting-style {
          translate: 0 1rem;
          opacity: 0;
        }
      }
    }

    .darkmode-toggle {
      border: none;
      padding: 0;

      .icon {
        inline-size: 30px;
        block-size: 30px;
      }

      &:where(:hover, :focus-visible) {
        box-shadow: none;
      }

      &:focus {
        @include outline;

        &:not(:focus-visible) {
          outline: none;
          box-shadow: none;
        }
      }
    }
  }
</style>
`
}

export function createNavigationItems(includeLauncher: boolean): string {
  return `---
import themeConfig from '@theme-config'
import { Link, DarkMode } from 'accessible-astro-components'
${includeLauncher ? "import { LauncherTrigger } from 'accessible-astro-launcher'" : ''}
import { Icon } from 'astro-icon/components'

const currentPathname = Astro.url.pathname

const isCurrentPage = (href: string): boolean => {
  if (href === '/') {
    return currentPathname === '/'
  }

  return currentPathname.startsWith(href)
}
---

<ul class="menu">
  {
    themeConfig.navigation.items.map((item) => (
      <li class={\`menu-item \${item.type === 'dropdown' ? 'has-dropdown' : ''}\`}>
        {item.type === 'dropdown' ? (
          <button aria-haspopup="true" aria-expanded="false">
            {item.label}
            <Icon aria-hidden="true" name="lucide:chevron-down" size="24" />
          </button>
        ) : !item.type || item.type === 'link' ? (
          <Link
            href={item.href}
            isExternal={item.external ?? false}
            hideIcon={!!item.icon}
            class={isCurrentPage(item.href) ? 'is-active' : undefined}
            aria-current={isCurrentPage(item.href) ? 'page' : undefined}
          >
            {item.icon ? (
              <>
                <Icon aria-hidden="true" name={item.icon} size="24" />
                <span class="sr-only">{item.label}</span>
              </>
            ) : (
              item.label
            )}
          </Link>
        ) : null}
        {item.type === 'dropdown' && (
          <ul class="dropdown-menu">
            {item.items.map((subItem) => (
              <li class="submenu-item">
                <Link
                  href={subItem.href}
                  isExternal={subItem.external ?? false}
                  class={isCurrentPage(subItem.href) ? 'is-active' : undefined}
                  aria-current={isCurrentPage(subItem.href) ? 'page' : undefined}
                >
                  {subItem.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))
  }
  {
    themeConfig.navigation.darkmode && (
      <li class="menu-item type-icon animate-rotate">
        <DarkMode>
          <Icon aria-hidden="true" name="lucide:moon" slot="light" />
          <Icon aria-hidden="true" name="lucide:sun" slot="dark" />
        </DarkMode>
      </li>
    )
  }
${includeLauncher ? `  <li class="menu-item desktop-launcher">
    <LauncherTrigger launcherId="site-launcher" compact={true} gradientBorder={true} />
  </li>` : ''}
</ul>
`
}

export function createHero(options: Pick<ResolvedOptions, 'preset' | 'siteName'>): string {
  const [firstWord = '', ...remainingWords] = options.siteName.trim().split(/\s+/)
  const remainingTitle = remainingWords.length > 0 ? ` ${escapeForHtml(remainingWords.join(' '))}` : ''
  const description =
    options.preset === 'blog'
      ? 'A clean, accessible blog starter with a contact flow and room to shape your editorial voice.'
      : options.preset === 'portfolio'
        ? 'Showcase your work with accessible project pages, content collections, and a simple contact flow.'
      : 'A flexible starting point for publishing content, sharing work, and building accessibly with Astro.'
  const notification =
    options.preset === 'blog'
      ? `
        <Notification type="info" variant="accent">
          <p>Update the blog routes, data source, and homepage copy to match how you want to publish content.</p>
        </Notification>`
      : options.preset === 'portfolio'
        ? `
        <Notification type="info" variant="accent">
          <p>Swap the placeholder project content for your own case studies and update the tags to match your work.</p>
        </Notification>`
      : ''
  const actions =
    options.preset === 'blog'
      ? `<Link href="/blog" isButton type="primary" animateOnHover animationType="boop">Browse posts</Link>`
      : options.preset === 'portfolio'
        ? `<Link href="/portfolio" isButton type="primary" animateOnHover animationType="boop">View projects</Link>`
      : `<Link
            href="https://github.com/incluud/accessible-astro-starter"
            isButton
            type="primary"
            animateOnHover
            animationType="boop"
          >
            <Icon aria-hidden="true" name="lucide:star" size="1.5rem" />
            Star on GitHub
          </Link>
          <Link
            href="https://accessible-astro.incluud.dev/"
            isButton
            type="secondary"
            animateOnHover
            animationType="boop"
          >
            <Icon aria-hidden="true" name="lucide:bookmark" size="1.5rem" />
            Read the docs
          </Link>`

  return `---
import { Link, Notification } from 'accessible-astro-components'
import { Icon } from 'astro-icon/components'
import { Image } from 'astro:assets'

/**
 * Hero Component
 *
 * @description A component that displays a hero section with a title, description, and image
 */
interface Props {
  /**
   * The source URL for the image
   */
  src?: string
}

const { src = '/astronaut-hero-img.webp' }: Props = Astro.props
---

<section class="hero my-24">
  <div class="container">
    <div class="grid grid-cols-1 items-center gap-24 lg:grid-cols-2">
      <div class="flex flex-col items-center gap-8 md:items-start">
        <h1 class="text-center text-6xl md:text-left lg:text-8xl"><span class="text-gradient">${escapeForHtml(firstWord)}</span>${remainingTitle}</h1>
${notification}
        <p class="text-center text-2xl md:text-left">
          ${description}
        </p>
        <div class="flex flex-col gap-3 min-[500px]:flex-row">
          ${actions}
        </div>
      </div>
      <Image class="hidden lg:block" src={src} alt="" decoding="async" width={800} height={600} loading="eager" />
    </div>
  </div>
</section>

<style lang="scss">
  h1 {
    text-wrap: unset;
  }

  .text-gradient {
    background: linear-gradient(
      315deg,
      light-dark(var(--color-primary-300), var(--color-secondary-100)) 25%,
      light-dark(var(--color-secondary-300), var(--color-primary-200))
    );
    background-clip: border-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
`
}

export function createFooter(manifest: Pick<ProjectManifest, 'preset'>): string {
  if (manifest.preset === 'barebones') {
    return `---
import { Link } from 'accessible-astro-components'

const currentYear = new Date().getFullYear()
---

<footer>
  <section class="py-8">
    <div class="container flex flex-col gap-4 md:flex-row md:justify-between">
      <p>
        &copy; {currentYear} - Starter Theme for <Link href="https://astro.build/">Astro</Link>.
      </p>
      <p>
        Made with ❤️ by <Link href="https://github.com/markteekman">Mark Teekman</Link>. Part of <Link
          href="https://www.incluud.dev">Incluud</Link
        >.
      </p>
    </div>
  </section>
</footer>

<style>
  footer section {
    border-top: 1px solid var(--border-color-subtle);
  }
</style>
`
  }

  return `---
import themeConfig from '@theme-config'
import { Heading, Link } from 'accessible-astro-components'

const currentYear = new Date().getFullYear()

const footerLinks = themeConfig.navigation.items.flatMap((item) => {
  if (item.type === 'dropdown') {
    return item.items.filter((subItem) => !subItem.external)
  }

  if (!item.type || item.type === 'link') {
    return item.external ? [] : [item]
  }

  return []
})

const socialLinks = themeConfig.socials ?? []
---

<footer>
  <section class="py-16">
    <div class="container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div class="space-content">
        <Heading level="h2" size="h4">{themeConfig.name}</Heading>
        <p>
          Replace this footer with your own links, business details, and supporting copy once you start customizing the
          project.
        </p>
      </div>
      {
        footerLinks.length > 0 && (
          <div>
            <Heading level="h2" size="h6" class="mb-4">Pages</Heading>
            <ul class="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <li>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        )
      }
      {
        socialLinks.length > 0 && (
          <div>
            <Heading level="h2" size="h6" class="mb-4">Socials</Heading>
            <ul class="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <li>
                  <Link href={link.href} isExternal>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  </section>
  <section class="py-8">
    <div class="container flex flex-col gap-4 md:flex-row md:justify-between">
      <p>
        &copy; {currentYear} - Starter Theme for <Link href="https://astro.build/">Astro</Link>.
      </p>
      <p>
        Made with ❤️ by <Link href="https://github.com/markteekman">Mark Teekman</Link>. Part of <Link
          href="https://www.incluud.dev">Incluud</Link
        >.
      </p>
    </div>
  </section>
</footer>

<style>
  footer section {
    border-top: 1px solid var(--border-color-subtle);
  }
</style>
`
}

export function createLauncherConfig(manifest: ProjectManifest): string {
  const blogImports = manifest.keepBlog ? ["import { BLOG_API_URL } from 'astro:env/server'", "import { slugify } from '@utils/slugify'"] : []
  const portfolioImports = manifest.keepPortfolio ? ["import { getCollection } from 'astro:content'"] : []

  const blogItems = manifest.keepBlog
    ? `const maxLauncherBlogPosts = 30

const truncateBlogTitle = (title: string): string => {
  return title.split(' ').slice(0, 4).join(' ')
}

const launcherBlogItems = await (async () => {
  if (!BLOG_API_URL) return []

  try {
    const response = await fetch(BLOG_API_URL)
    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as Array<{ title: string }>

    return data.slice(0, maxLauncherBlogPosts).map((post) => {
      const truncatedTitle = truncateBlogTitle(post.title)
      return {
        label: truncatedTitle,
        href: \`/blog/\${slugify(truncatedTitle)}\`,
      }
    })
  } catch {
    return []
  }
})()`
    : "const launcherBlogItems: Array<{ label: string; href: string }> = []"

  const projectItems = manifest.keepPortfolio
    ? `const launcherProjectItems = (await getCollection('projects')).map((project) => ({
  label: project.data.title,
  href: \`/portfolio/\${project.id}\`,
  keywords: [project.data.author, ...project.data.tags],
}))`
    : "const launcherProjectItems: Array<{ label: string; href: string; keywords?: string[] }> = []"

  return `---
import {
  Launcher,
  LauncherPreferences,
  LauncherSwitch,
  LauncherNav,
  LauncherLink,
} from 'accessible-astro-launcher'
import { Icon } from 'astro-icon/components'
${portfolioImports.join('\n')}
${blogImports.join('\n')}
import themeConfig from '@theme-config'

const launcherPreferenceItems = [
  {
    label: 'Dark mode',
    onAction: 'toggle-dark-mode',
  },
  {
    label: 'High contrast',
    onAction: 'toggle-high-contrast',
  },
  {
    label: 'Reduced motion',
    onAction: 'toggle-reduced-motion',
  },
]

${blogItems}

${projectItems}

const launcherNavigationItems = themeConfig.navigation.items.flatMap((item) => {
  if (item.type === 'dropdown') {
    return item.items.map((subItem) => ({
      label: subItem.label,
      href: subItem.href,
      external: subItem.external ?? false,
    }))
  }

  if (!item.type || item.type === 'link') {
    return [
      {
        label: item.label,
        href: item.href,
        external: item.external ?? false,
      },
    ]
  }

  return []
})

const launcherSocialItems = (themeConfig.socials ?? []).map((item) => ({
  label: item.label,
  href: item.href,
  icon: item.icon,
  external: item.external ?? false,
}))
---

<Launcher id="site-launcher">
  <LauncherPreferences label="Preferences">
    {
      launcherPreferenceItems.map((item) => (
        <LauncherSwitch label={item.label} onAction={item.onAction} />
      ))
    }
  </LauncherPreferences>
  <LauncherNav label="Navigate to">
    {
      launcherNavigationItems.map((item) => (
        <LauncherLink
          label={item.label}
          href={item.href}
          {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        />
      ))
    }
  </LauncherNav>
  {
    launcherBlogItems.length > 0 && (
      <LauncherNav label="Blog posts">
        {launcherBlogItems.map((item) => (
          <LauncherLink label={item.label} href={item.href}>
            <Icon slot="icon" aria-hidden="true" name="lucide:scroll-text" size="16" />
          </LauncherLink>
        ))}
      </LauncherNav>
    )
  }
  {
    launcherProjectItems.length > 0 && (
      <LauncherNav label="Projects">
        {launcherProjectItems.map((item) => (
          <LauncherLink label={item.label} href={item.href} keywords={item.keywords}>
            <Icon slot="icon" aria-hidden="true" name="lucide:bookmark" size="16" />
          </LauncherLink>
        ))}
      </LauncherNav>
    )
  }
  {
    launcherSocialItems.length > 0 && (
      <LauncherNav label="Socials">
        {launcherSocialItems.map((item) => (
          <LauncherLink
            label={item.label}
            href={item.href}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <Icon slot="icon" aria-hidden="true" name={item.icon} size="16" />
          </LauncherLink>
        ))}
      </LauncherNav>
    )
  }
</Launcher>
`
}

function createFullIndex(siteName: string): string {
  return `---
import DefaultLayout from '@layouts/DefaultLayout.astro'
import Hero from '@components/Hero.astro'
import Feature from '@components/Feature.astro'
import FeaturedPosts from '@components/FeaturedPosts.astro'
import FeaturedProjects from '@components/FeaturedProjects.astro'
---

<DefaultLayout title="${escapeForHtml(siteName)}" useTitleTemplate={false}>
  <Hero />

  <section class="mb-24">
    <div class="container grid gap-6 md:grid-cols-3">
      <Feature icon="lucide:layout-template" title="Start with real structure" level="h2">
        Edit theme.config.ts, replace placeholder copy, and shape the starter around your content model.
      </Feature>
      <Feature icon="lucide:scissors" title="Keep what you need" level="h2">
        This preset includes the blog, portfolio, contact flow, and reference pages so you can trim from a rich base.
      </Feature>
      <Feature icon="lucide:accessibility" title="Build accessibly" level="h2">
        Navigation, color tokens, logical properties, and readable typography are ready from the start.
      </Feature>
    </div>
  </section>

  <FeaturedPosts />
  <FeaturedProjects />
</DefaultLayout>
`
}

function createBlogIndex(siteName: string): string {
  return `---
import DefaultLayout from '@layouts/DefaultLayout.astro'
import Hero from '@components/Hero.astro'
import FeaturedPosts from '@components/FeaturedPosts.astro'
---

<DefaultLayout title="${escapeForHtml(siteName)}" useTitleTemplate={false}>
  <Hero />

  <FeaturedPosts />
</DefaultLayout>
`
}

function createPortfolioIndex(siteName: string): string {
  return `---
import DefaultLayout from '@layouts/DefaultLayout.astro'
import Hero from '@components/Hero.astro'
import FeaturedProjects from '@components/FeaturedProjects.astro'
---

<DefaultLayout title="${escapeForHtml(siteName)}" useTitleTemplate={false}>
  <Hero />

  <FeaturedProjects />
</DefaultLayout>
`
}

function createMinimalIndex(siteName: string): string {
  const cards = createFeatureCards([
    {
      title: 'Edit the homepage',
      body: 'Use this page as your hero, landing page, or simple hub for a small accessible site.',
    },
    {
      title: 'Shape your content',
      body: 'The preset keeps about and contact pages so you can move quickly without extra demo sections.',
    },
    {
      title: 'Adjust the theme',
      body: 'Update colors, metadata, and navigation in theme.config.ts to match your brand.',
    },
  ])

  return `---
import DefaultLayout from '@layouts/DefaultLayout.astro'
import { Heading, Link } from 'accessible-astro-components'
---

<DefaultLayout title="${escapeForHtml(siteName)}" useTitleTemplate={false}>
  <section class="my-24">
    <div class="space-content container">
      <Heading level="h1">${escapeForHtml(siteName)}</Heading>
      <p class="text-2xl">
        A lightweight accessible site with just enough structure to start writing and shipping quickly.
      </p>
      <div class="flex flex-wrap gap-4">
        <Link href="/about" isButton type="primary" animateOnHover animationType="boop">About</Link>
        <Link href="/contact" isButton type="secondary" animateOnHover animationType="boop">Contact</Link>
      </div>
    </div>
  </section>

  <section class="mb-24">
    <div class="container grid gap-6 md:grid-cols-3">
${indent(cards, 6)}
    </div>
  </section>
</DefaultLayout>
`
}

function createBarebonesIndex(siteName: string): string {
  return `---
import DefaultLayout from '@layouts/DefaultLayout.astro'
import { Heading, Notification } from 'accessible-astro-components'
---

<DefaultLayout title="${escapeForHtml(siteName)}" useTitleTemplate={false}>
  <section class="my-24">
    <div class="space-content container">
      <Heading level="h1">${escapeForHtml(siteName)}</Heading>
      <p class="text-2xl">
        This is a barebones accessible Astro foundation with the core layout, navigation, footer, and styles intact.
      </p>
      <Notification type="info">
        <p>Start by editing this page, theme.config.ts, and the navigation to match your project.</p>
      </Notification>
    </div>
  </section>
</DefaultLayout>
`
}

export function createIndexPage(options: ResolvedOptions): string {
  switch (options.preset) {
    case 'blog':
      return createBlogIndex(options.siteName)
    case 'portfolio':
      return createPortfolioIndex(options.siteName)
    case 'minimal':
      return createMinimalIndex(options.siteName)
    case 'barebones':
      return createBarebonesIndex(options.siteName)
    case 'full':
    default:
      return createFullIndex(options.siteName)
  }
}

export function createAboutPage(siteName: string): string {
  return `---
import DefaultLayout from '@layouts/DefaultLayout.astro'
import PageHeader from '@components/PageHeader.astro'
import { Heading } from 'accessible-astro-components'
---

<DefaultLayout title="About">
  <PageHeader
    title="About"
    subtitle="Use this page to introduce ${escapeForHtml(siteName)}, your work, and the people behind it."
    bgType="bordered"
  />
  <section class="my-16">
    <div class="narrow space-content container">
      <Heading level="h2">Tell your story</Heading>
      <p>
        Share what you do, who you help, and what makes your work distinctive. This starter keeps the structure simple
        so you can adapt it to a portfolio, studio site, personal site, or small business presence.
      </p>
      <p>
        You can expand this page with testimonials, process notes, service descriptions, or a short timeline once the
        core content is in place.
      </p>
    </div>
  </section>
</DefaultLayout>
`
}

export function createContactPage(): string {
  return `---
import DefaultLayout from '@layouts/DefaultLayout.astro'
import PageHeader from '@components/PageHeader.astro'
import { Form, Input, Button, Textarea, Heading, Link } from 'accessible-astro-components'
import { Icon } from 'astro-icon/components'
---

<DefaultLayout title="Contact">
  <PageHeader
    title="Contact"
    subtitle="Use this page as a starting point for contact forms, enquiries, bookings, or support."
    bgType="gradient"
  />
  <section class="container my-16">
    <div class="grid grid-cols-1 gap-16 md:grid-cols-2">
      <div class="space-content">
        <Heading level="h2">Send a message</Heading>
        <Form name="contact" action="/thank-you" method="post">
          <Input name="name" label="Name" required autocomplete="name" />
          <Input name="email" label="Email address" type="email" required autocomplete="email" />
          <Textarea name="message" label="Message" required />
          <Button htmlType="submit" type="primary">Send message</Button>
        </Form>
      </div>
      <div class="space-content">
        <Heading level="h2">Contact details</Heading>
        <p>Replace these placeholders with your own email address, availability, and preferred contact channels.</p>
        <div class="gap-2xs flex items-center">
          <Icon aria-hidden="true" name="lucide:mail" size={20} class="shrink-0" />
          <p>
            <span class="font-bold">Email:</span>
            <Link href="mailto:hello@example.com">hello@example.com</Link>
          </p>
        </div>
        <div class="gap-2xs flex items-center">
          <Icon aria-hidden="true" name="lucide:clock" size={20} class="shrink-0" />
          <p>
            <span class="font-bold">Availability:</span>
            Monday to Thursday, 9:00 to 17:00
          </p>
        </div>
      </div>
    </div>
  </section>
</DefaultLayout>
`
}

export function createThankYouPage(): string {
  return `---
import DefaultLayout from '@layouts/DefaultLayout.astro'
import PageHeader from '@components/PageHeader.astro'
import { Link, Notification } from 'accessible-astro-components'
import { Icon } from 'astro-icon/components'
---

<DefaultLayout title="Thank you">
  <PageHeader title="Thank you" subtitle="Your form submission was received." bgType="gradient" />
  <section class="container my-16">
    <div class="space-content">
      <Notification type="info">
        <Icon aria-hidden="true" name="lucide:info" size={24} />
        <p>Customize this page with your own confirmation message, follow-up details, or next steps.</p>
      </Notification>
      <Link href="/contact" isButton type="primary" animateOnHover animationType="boop">
        Back to contact
      </Link>
    </div>
  </section>
</DefaultLayout>
`
}

export function createReadme(options: ResolvedOptions): string {
  const preset = formatPresetLabel(options.preset)
  const launcher = options.includeLauncher ? 'Included' : 'Removed'

  return [
    `# ${options.siteName}`,
    '',
    'This project was generated with `npm create accessible-astro-starter@latest`.',
    '',
    '## Included setup',
    '',
    `- Preset: ${preset}`,
    `- Launcher: ${launcher}`,
    '',
    '## Getting started',
    '',
    '```bash',
    'npm install',
    'npm run dev',
    '```',
    '',
    '## What to customize first',
    '',
    '- Update `theme.config.ts` with your site name, metadata, and navigation.',
    '- Replace the placeholder copy in `src/pages/`.',
    '- Adjust colors and spacing tokens in the theme and SCSS as needed.',
    '',
    '## Available commands',
    '',
    '| Command | Action |',
    '| :------ | :----- |',
    '| `npm run dev` | Start the local dev server |',
    '| `npm run build` | Build the production site |',
    '| `npm run preview` | Preview the production build locally |',
    '',
  ].join('\n')
}
