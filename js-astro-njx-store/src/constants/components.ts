/**
 * All copy for the theme "shell": header, footer, drawers, search, modal, product card.
 * Change the copy here — component markup stays untouched.
 */

export const SITE = {
  name: 'njx-shop',
  defaultTitle: 'njX Shop — good gear for long builds',
  defaultDescription:
    'Demo storefront for astro-njx-store: apparel, desk goods and coffee. Astro + Tailwind, mock data out of the box, Shopify with two env vars.',
  logoDark: '/logo/njx-shop-dark.png', // dark mark — shown on the light theme
  logoLight: '/logo/njx-shop-light.png', // light mark — shown on the dark theme
  // Catalogue-clean placeholders (astro.build/themes rule: social icons must link
  // to a root domain with no username; only example.com for placeholder URLs).
  repoUrl: 'https://github.com',
  authorUrl: 'https://example.com',
  themesUrl: 'https://example.com',
} as const;

export const ANNOUNCEMENT = {
  text: 'Free shipping on orders over $75 — roasted and packed every Monday',
  linkLabel: 'Shop new arrivals →',
  linkHref: '/collections/apparel',
} as const;

export const HEADER = {
  navLinks: [
    { label: 'Apparel', href: '/collections/apparel' },
    { label: 'Desk', href: '/collections/desk' },
    { label: 'Coffee', href: '/collections/coffee' },
  ],
  aria: {
    search: 'Search',
    account: 'Account',
    favorites: 'Favorites',
    theme: 'Toggle theme',
    cart: 'Open cart',
    menu: 'Open menu',
  },
} as const;

export const SEARCH = {
  placeholder: 'Search products…',
  escHint: 'Esc',
  emptyText: 'Nothing found — try “hoodie”, “walnut” or “coffee”.',
} as const;

export const FOOTER = {
  tagline:
    'Good gear for long builds. A demo store for the astro-njx-store theme — every product here is fictional, the checkout is real.',
  columns: [
    {
      title: 'Shop',
      links: [
        { label: 'Apparel', href: '/collections/apparel' },
        { label: 'Desk & setup', href: '/collections/desk' },
        { label: 'Coffee', href: '/collections/coffee' },
      ],
    },
    {
      title: 'Pages',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contacts', href: '/contacts' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      title: 'More',
      links: [
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'GitHub', href: 'https://github.com' },
        { label: 'Built with Astro', href: 'https://astro.build' },
      ],
    },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
} as const;

export const THANKS_MODAL = {
  emoji: '🎉',
  title: 'Thanks for the order!',
  text: 'This is a demo store, so nothing was charged. A confirmation would normally land in your inbox in a minute.',
  starLabel: 'View your orders',
  starHref: '/account',
  keepLabel: 'Keep browsing',
  madeByLabel: 'Built with Astro',
  madeByHref: 'https://astro.build',
  moreLabel: 'Browse the shop →',
  moreHref: '/',
} as const;

export const CART = {
  ariaDrawer: 'Shopping cart',
  clearLabel: 'Clear all',
  ariaClear: 'Clear cart',
  ariaClose: 'Close cart',
  emptyLine1: 'Your cart is empty.',
  emptyLine2: 'Everything ships free over $75.',
  subtotalLabel: 'Subtotal',
  shippingNote: 'Shipping and taxes calculated at checkout.',
  checkoutLabel: 'Checkout',
  checkoutPreparing: 'Preparing checkout…',
  checkoutFailedPrefix: 'Checkout failed: ',
} as const;

export const NAV_DRAWER = {
  ariaDrawer: 'Site navigation',
  ariaClose: 'Close menu',
  home: { label: 'Home', href: '/' },
  collections: [
    { label: 'Apparel', href: '/collections/apparel' },
    { label: 'Desk & setup', href: '/collections/desk' },
    { label: 'Coffee', href: '/collections/coffee' },
  ],
  pages: [
    { label: 'About', href: '/about' },
    { label: 'Contacts', href: '/contacts' },
    { label: 'FAQ', href: '/faq' },
  ],
  footer: {
    builtWithLabel: 'Built with',
    libLabel: 'Astro',
    libHref: 'https://astro.build',
    starLabel: 'GitHub',
    starHref: 'https://github.com',
  },
} as const;

export const PRODUCT_CARD = {
  saleBadge: 'Sale',
  addToCart: 'Add to cart',
  ariaFav: (title: string) => `Add ${title} to favorites`,
  ariaAdd: (title: string) => `Add ${title} to cart`,
} as const;
