/**
 * All page copy lives here. One section — one object.
 * Fields ending in *Html are injected via set:html (they contain links/code) — edit carefully.
 */
import { SITE } from './components';

export const HOME = {
  meta: {
    // empty = defaults from SITE (Layout fills them in)
  },
  hero: {
    title: 'Good gear for long builds.',
    text: 'Heavyweight tees, walnut desk goods and coffee roasted the week it ships. Small-batch things for the hours nobody sees.',
    ctaPrimary: { label: 'Shop apparel', href: '/collections/apparel' },
    ctaSecondary: { label: 'Fresh coffee', href: '/collections/coffee' },
    note: 'Ships worldwide from one small warehouse. 30-day returns, no forms.',
    image: { src: '/products/hero.jpg', alt: 'Walnut desk setup with laptop and coffee' },
  },
  themeBar: {
    text: 'This store is a free Astro theme.',
    cta: { label: 'Get it on GitHub', href: SITE.repoUrl },
    cta2: { label: 'All themes & Pro', href: SITE.themesUrl },
  },
  collections: { title: 'Shop by collection' },
  products: { title: 'Everything we make', countLabel: 'products' },
  values: [
    {
      title: 'Made to be used up',
      text: '220 gsm cotton, solid walnut, merino felt. Materials that wear in, not out.',
    },
    {
      title: 'Roasted this week',
      text: 'Coffee leaves the roaster on Monday and your doorstep by Friday. Date on every bag.',
    },
    {
      title: 'Returns without forms',
      text: "30 days, reply to your order email, done. If it's not right, it goes back.",
    },
  ],
  quote: {
    text: '“The hoodie survived two winters and a hundred deploys. The coffee is the reason the deploys shipped.”',
    author: 'Jamie R., customer since 2024',
  },
  colophon: {
    eyebrow: 'njx-store · free ecommerce theme for Astro',
    title: 'This whole store is a theme. Take it.',
    text: 'Everything you just clicked — cart, search, favorites, dark mode, checkout — is njx-store Lite, a static storefront you can fork today. Point one env var at your Shopify store and these same pages rebuild from your real catalog, hosted checkout included.',
    ctaPrimary: { label: 'Get the theme on GitHub', href: SITE.repoUrl },
    ctaSecondary: { label: 'How it works', href: '/about#theme' },
    ctaThemes: { label: 'All themes & Pro', href: SITE.themesUrl },
    stack: [
      { strong: 'Astro 5 + Tailwind v4', text: '— 18 static pages, zero client framework' },
      { strong: 'Node.js build', text: '— data layer runs at build time, ships pure HTML' },
      { strong: 'Shopify Storefront API', text: '— live products, cart and hosted checkout' },
      { strong: 'Cloudflare Pages', text: '— deploys in seconds on the free tier' },
    ],
    env: {
      prefix: 'COMMERCE_PROVIDER=',
      value: 'shopify',
      copyValue: 'COMMERCE_PROVIDER=shopify',
      copiedLabel: 'Copied ✓',
    },
  },
} as const;

export const COLLECTION = {
  metaSuffix: ` — ${SITE.name === 'njx-shop' ? 'njX Shop' : SITE.name}`,
  allTag: 'All',
  sortLabel: 'Sort',
  sortOptions: [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'title', label: 'Name A–Z' },
  ],
  emptyCollection: 'Nothing here yet — check the other collections.',
  emptyFilter: 'No products match this filter.',
} as const;

export const PRODUCT = {
  breadcrumbHome: 'Home',
  optionsLegend: 'Options',
  addToCart: 'Add to cart',
  accordion: [
    {
      title: 'Shipping',
      text: 'Free over $75, otherwise $6 flat. Orders leave the warehouse within 48 hours; tracking in your inbox the moment it ships.',
    },
    {
      title: 'Returns',
      text: '30 days from delivery. Reply to your order email and we\'ll send a label — no forms, no questions beyond "what went wrong?".',
    },
  ],
  relatedTitle: 'Goes well with',
} as const;

export const ABOUT = {
  meta: {
    title: 'About — njX Shop',
    description: 'Who makes njX Shop: three people, one warehouse, goods for the hours nobody sees.',
  },
  hero: {
    title: 'Built for the hours nobody sees.',
    paragraphs: [
      "njX Shop started as a side table of leftover conference tees and one bag of over-roasted beans. It grew into a small catalog of things we actually use every day: clothes that survive the wash, wood that outlives the laptop on top of it, coffee that ships the week it's roasted.",
      "We're three people and one warehouse. No growth team, no seasonal drops — a product joins the catalog when we've used it for a month and still like it.",
    ],
    image: { src: '/products/hero.jpg', alt: 'The desk where njX Shop gets planned' },
  },
  numbers: [
    { num: '2019', label: 'first tee printed' },
    { num: '14k', label: 'orders shipped' },
    { num: '3', label: 'people in the team' },
    { num: '1', label: 'small warehouse' },
  ],
  themeBlock: {
    eyebrow: 'The honest part',
    title: 'This store is a demo. The theme is real.',
    textHtml:
      'The tees, the warehouse, Jamie and their hundred deploys — all invented to show <strong class="font-semibold text-ink">njx-store</strong>, a free ecommerce theme for Astro, working at full speed. This is the Lite version: fork it, swap the catalog, and you have a storefront of your own. An extended Pro version with more sections and pages is on the way.',
    cta: { label: 'Get it on GitHub', href: SITE.repoUrl },
    howTitle: 'How the integration works',
    howItemsHtml: [
      '<strong class="font-medium text-ink">Astro 5 renders everything statically.</strong> A Node.js build fetches the catalog once and ships pure HTML — no client framework, fast by default.',
      '<strong class="font-medium text-ink">Two data providers, one switch.</strong> <code class="rounded bg-tile px-1.5 py-0.5 font-mono text-[13px]">COMMERCE_PROVIDER=mock</code> uses the bundled JSON catalog; <code class="rounded bg-tile px-1.5 py-0.5 font-mono text-[13px]">shopify</code> pulls real products over the Shopify Storefront API (GraphQL).',
      "<strong class=\"font-medium text-ink\">Checkout stays on Shopify.</strong> The cart lives in localStorage; at checkout the theme creates a Shopify cart and hands off to their hosted, PCI-compliant checkout.",
      '<strong class="font-medium text-ink">Hosted on Cloudflare Pages.</strong> Static output deploys in seconds and runs comfortably on the free tier.',
    ],
  },
  cta: {
    title: 'Want to say hi?',
    text: 'We answer every email ourselves — usually within a day.',
    button: { label: 'Contact us', href: '/contacts' },
  },
} as const;

export const CONTACTS = {
  meta: {
    title: 'Contacts — njX Shop',
    description: 'Questions about an order, sizing or wholesale — write to njX Shop.',
  },
  title: 'Talk to us',
  text: 'Orders, sizing, wholesale, or just to tell us what to make next. A human answers — usually within a day.',
  cards: {
    email: {
      title: 'Email',
      address: 'hello@example.com',
      note: 'Order number in the subject speeds things up.',
    },
    warehouse: {
      title: 'Warehouse',
      lines: ['Unit 4, 12 Roastery Lane', 'Portland, OR — by appointment'],
    },
    elsewhere: {
      title: 'Elsewhere',
      links: [
        { label: 'GitHub', href: 'https://github.com' },
        { label: 'Instagram', href: 'https://instagram.com' },
      ],
    },
  },
  form: {
    nameLabel: 'Name',
    namePlaceholder: 'Alex Builder',
    emailLabel: 'Email',
    emailPlaceholder: 'you@work.com',
    messageLabel: 'Message',
    messagePlaceholder: "What's on your mind?",
    submitLabel: 'Send message',
    demoNote: "Demo mode — the form isn't wired to a backend. Point it at your email service or an API route.",
  },
} as const;

export const FAQ_PAGE = {
  meta: {
    title: 'FAQ — njX Shop',
    description: 'Shipping, returns, sizing and coffee freshness — answers to the questions we get most.',
  },
  title: 'Questions we get',
  introHtml:
    'Short answers, no legal fog. Missing something? <a href="/contacts" class="text-pine underline underline-offset-2">Write to us.</a>',
  items: [
    {
      q: 'How long does shipping take?',
      a: 'Orders leave the warehouse within 48 hours. US: 2–5 business days. EU and the rest of the world: 7–14 days. Free over $75, $6 flat otherwise, tracking always included.',
    },
    {
      q: 'How do returns work?',
      a: '30 days from delivery. Reply to your order email, we send a label, you drop it off. No forms and no questions beyond “what went wrong?” — that part genuinely helps us fix things.',
    },
    {
      q: 'How do the tees fit?',
      a: 'Boxy and true to size. If you are between sizes, take the smaller one — the 220 gsm cotton relaxes half a size after two washes.',
    },
    {
      q: 'How fresh is the coffee, really?',
      a: 'We roast on Mondays and ship the same week. The roast date is printed on every bag. If your bag is older than three weeks on arrival, write to us — it should not be.',
    },
    {
      q: 'Do you do wholesale?',
      a: 'For the desk goods and coffee — yes, from 20 units. Email hello@example.com with your shop and volumes.',
    },
    {
      q: 'Is this a real store?',
      a: 'It is a demo for the astro-njx-store theme: the products are fictional, but everything else works — cart, checkout flow, search, themes. Grab the theme on GitHub and make it your real store.',
    },
  ],
} as const;

export const ACCOUNT = {
  meta: {
    title: 'Account — njX Shop',
    description: 'Sign in to your njX Shop account or create a new one.',
  },
  tabs: { login: 'Sign in', register: 'Create account' },
  login: {
    title: 'Welcome back',
    sub: 'Orders, addresses and faster checkout.',
    submit: 'Sign in',
    demoNote: 'Demo mode — sign-in is a stub. Connect Shopify Customer Accounts or your own backend here.',
  },
  register: {
    title: 'Join njX Shop',
    sub: 'One account for orders, returns and early drops.',
    submit: 'Create account',
    demoNote: 'Demo mode — account creation is a stub. Connect Shopify Customer Accounts or your own backend here.',
  },
  fields: {
    nameLabel: 'Name',
    namePlaceholder: 'Alex Builder',
    emailLabel: 'Email',
    emailPlaceholder: 'you@work.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    remember: 'Remember me',
    forgot: 'Forgot password?',
  },
  pageNote: 'Demo page — wire it to Shopify Customer Accounts or your own auth backend.',
} as const;

export const FAVORITES_PAGE = {
  meta: { title: 'Favorites — njX Shop', description: 'Products you saved for later.' },
  title: 'Favorites',
  subEmpty: 'Everything you save, in one place.',
  subCount: (n: number) => `${n} ${n === 1 ? 'product' : 'products'} saved for later.`,
  empty: {
    icon: '♡',
    title: 'Nothing saved yet',
    text: 'Tap the heart on any product and it will wait for you here.',
    cta: { label: 'Browse the store', href: '/' },
  },
  ariaRemove: (title: string) => `Remove ${title} from favorites`,
} as const;

export const NOT_FOUND = {
  meta: { title: 'Page not found — njX Shop' },
  title: 'Nothing here.',
  text: 'This page moved, sold out, or never existed. The good stuff is one click away.',
  ctaPrimary: { label: 'Back to the store', href: '/' },
  ctaSecondary: { label: 'Get coffee instead', href: '/collections/coffee' },
} as const;

export const PRIVACY = {
  meta: {
    title: 'Privacy Policy — njX Shop',
    description: 'How njX Shop handles your data: what we collect, why, and what we never do.',
  },
  title: 'Privacy Policy',
  updated: 'Last updated: September 2026 · Demo content — replace with your own policy.',
  sections: [
    {
      h: 'What we collect',
      p: "Order details (what you bought, where to ship it), your email for order updates, and basic analytics about how the store is used. That's the whole list.",
    },
    {
      h: 'What we never do',
      p: "We don't sell your data, we don't run third-party ad trackers, and we don't email you unless it's about an order or you explicitly signed up for the newsletter.",
    },
    {
      h: 'Payments',
      p: 'Card details never touch our servers — checkout is processed by our payment provider. We see the order, not the card.',
    },
    {
      h: 'Your rights',
      p: "Want your data exported or deleted? Email us and it's done within 30 days — usually much faster, there are three of us and one inbox.",
    },
  ],
} as const;

export const TERMS = {
  meta: {
    title: 'Terms of Service — njX Shop',
    description: 'The short, honest terms for shopping at njX Shop: orders, shipping, returns and refunds.',
  },
  title: 'Terms of Service',
  updated: 'Last updated: September 2026 · Demo content — replace with your own terms.',
  sections: [
    {
      h: 'Orders',
      p: 'An order is confirmed when you get the confirmation email. If something is out of stock after you paid, we refund that item the same day and tell you.',
    },
    {
      h: 'Shipping',
      p: 'We ship within 2 business days. Tracking arrives by email. If a package goes missing, we deal with the carrier — not you.',
    },
    {
      h: 'Returns & refunds',
      p: '30 days, no questions, item in usable condition. Coffee is the exception once opened — for obvious reasons. Refunds go back to the original payment method.',
    },
    {
      h: 'The fine print',
      p: 'Prices can change, typos happen, and we may update these terms — the date above always tells you when. Questions? The contacts page is one click away.',
    },
  ],
} as const;
