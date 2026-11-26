// Everything you'll want to change lives in this file: copy, links, images and
// the footer credit. Image paths are relative to /public (or full https:// URLs).

export interface Product { kicker: string; title: string; body: string; src: string; alt: string; pos?: string }
export interface Look { src: string; alt: string; height: string; ratio: string; drift: string; pos?: string; caption: [string, string]; blend?: boolean }
export interface Room { src: string; alt: string; ratio: string; drift: string; offset: string; caption: [string, string]; tall?: boolean }
export interface Shop { name: string; address: string[]; hours: string; directionsUrl: string; whatsappUrl: string }
export interface Brand { name: string; logo?: string }

export const site = {
  name: 'Olive & Pine',
  title: 'Olive & Pine — Clothing & coffee in Your Town',
  description: 'A small independent boutique, stocked by hand. Come in, try things on, stay for a cup of coffee.',
  lang: 'en',
  themeColor: '#161826',
  logo: 'logo.svg',
  favicon: 'favicon.svg',
  ogImage: 'images/hero.svg',
};

export const nav = {
  links: [
    { label: 'New in', href: '#new' },
    { label: 'Brands', href: '#brands' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'Shops', href: '#shops' },
  ],
  cta: { label: 'Visit us', href: '#shops' },
};

export const hero = {
  kicker: 'Your Town · Clothing & coffee',
  line: 'Dressed for the season.',
  sub: 'A small independent boutique, stocked by hand. Come in, try things on, stay for a cup of coffee.',
  image: 'images/hero.svg',
  imageAlt: 'The high street at dusk, the shop windows lit',
  primary: { label: "See what's new", href: '#new' },
  secondary: { label: 'Find the shop', href: '#shops' },
  scrollCue: 'Scroll',
};

export const arrivals = {
  kicker: 'New in',
  title: 'Unpacked this week',
  lede: 'A few pieces land every week and go straight to the rails. Nothing here is sold online — come and try it on.',
  note: 'Sizes and prices in store.',
  cta: { label: 'Ask about a piece', href: '#shops' },
  // Three to five items fan out best.
  items: [
    { kicker: 'Jackets', title: 'Leopard bomber', body: 'Printed satin', src: 'images/product-1.svg', alt: 'Leopard-print bomber jacket' },
    { kicker: 'Knitwear', title: 'Palm-print sweater', body: 'Navy cotton', src: 'images/product-2.svg', alt: 'Navy sweater with a palm print' },
    { kicker: 'Jackets', title: 'Tweed shirt jacket', body: 'Burgundy check', src: 'images/product-3.svg', alt: 'Burgundy check tweed jacket' },
    { kicker: 'Coats', title: 'Houndstooth coat', body: 'Black & ivory', src: 'images/product-4.svg', alt: 'Black and ivory houndstooth coat' },
    { kicker: 'Tees', title: 'Printed tees', body: 'Black and white', src: 'images/product-5.svg', alt: 'Printed T-shirts on hangers' },
  ] satisfies Product[],
};

export const brands = {
  kicker: 'Brands we carry',
  title: "Labels we'd buy ourselves.",
  lede: "The houses we know and love — never a whole collection, only the pieces we'd actually wear, picked season by season.",
  // Add `logo: 'images/brands/name.svg'` for a black-on-transparent logo (it is inverted to white
  // automatically). Without a logo the name is set as text. Only use logos you have permission to show.
  items: [
    { name: 'Brand One' }, { name: 'Brand Two' }, { name: 'Brand Three' },
    { name: 'Brand Four' }, { name: 'Brand Five' }, { name: 'Brand Six' },
  ] satisfies Brand[],
};

export const lookbook = {
  kicker: 'Lookbook',
  title: 'Late summer, worn our way',
  scrub: 'Keep scrolling',
  end: { title: 'The rest is on the rails.', label: 'Visit the shop →', href: '#shops' },
  looks: [
    { src: 'images/look-1.svg', alt: 'A cream tiered summer dress in a sunlit doorway', height: '52vh', ratio: '3 / 4', drift: '8%', pos: '50% 30%', caption: ['Look 01', 'Your Town'] },
    { src: 'images/look-2.svg', alt: 'Detail: stacked bracelets and a clutch', height: '40vh', ratio: '4 / 3', drift: '-6%', caption: ['Look 02', 'Detail'], blend: true },
    { src: 'images/look-3.svg', alt: 'Two printed tees on hangers in the window', height: '58vh', ratio: '3 / 4', drift: '10%', pos: '50% 45%', caption: ['Look 03', 'The window'] },
    { src: 'images/look-4.svg', alt: 'Detail: a straw hat and sunglasses', height: '44vh', ratio: '1 / 1', drift: '-8%', pos: '22% 50%', caption: ['Look 04', 'Detail'] },
    { src: 'images/look-5.svg', alt: 'A black and white top worn with white sunglasses', height: '52vh', ratio: '4 / 5', drift: '8%', pos: '50% 25%', caption: ['Look 05', 'Your Town'] },
  ] satisfies Look[],
};

export const inside = {
  kicker: 'Inside',
  title: 'Two small rooms, full rails',
  lede: 'White walls, a wooden shelf of bags, a rail of favourites. Small enough that we remember what you tried on last time.',
  rooms: [
    { src: 'images/inside-1.svg', alt: 'Inside the shop: a shelf of bags and a rail of clothes', ratio: '4 / 3', drift: '-10%', offset: '-18vh', caption: ['Shop 01', 'The rail'] },
    { src: 'images/inside-2.svg', alt: 'A straw hat and a knitted top styled on a mannequin', ratio: '3 / 4', drift: '8%', offset: '-26vh', caption: ['Shop 02', 'The window'], tall: true },
    { src: 'images/inside-3.svg', alt: 'Detail: clothes on wooden hangers along the rail', ratio: '16 / 10', drift: '-6%', offset: '-14vh', caption: ['Shop 01', 'Detail'] },
  ] satisfies Room[],
};

export const wine = {
  kicker: 'Clothing & coffee',
  quote: '“Come for the clothes. Stay for the cup.”',
  lede: "Every visit comes with something warm to drink. Take your time — the town isn't going anywhere.",
  images: [
    { src: 'images/band-1.svg', alt: 'The harbour at golden hour' },
    { src: 'images/band-2.svg', alt: 'Stacked bracelets and a clutch against a white tee and jeans' },
  ],
};

export const shops = {
  kicker: 'The shops',
  title: 'Find us in Your Town',
  openLabel: 'Open',
  directionsLabel: 'Directions',
  whatsappLabel: 'WhatsApp',
  // Add or remove shops freely; the photo sits in the last grid cell.
  items: [
    { name: 'Olive & Pine', address: ['[Street and number]', '00000 Your Town'], hours: '[Mon – Sun · 11:00 – 22:00]', directionsUrl: '#shops', whatsappUrl: '#shops' },
    { name: 'Olive & Pine Two', address: ['[Street and number]', '00000 Your Town'], hours: '[Mon – Sat · 10:00 – 20:00]', directionsUrl: '#shops', whatsappUrl: '#shops' },
  ] satisfies Shop[],
  photo: { src: 'images/shopfront.svg', alt: 'The shopfront: a red facade with a white awning', caption: 'The shopfront, Your Town' },
};

export const footer = {
  links: [
    { label: 'Instagram', href: '#shops' },
    { label: 'WhatsApp', href: '#shops' },
    { label: 'Back to top', href: '#top' },
  ],
  copyright: `© ${new Date().getFullYear()} Olive & Pine`,
};

// Footer credit for the theme author. It is a normal link, rendered by
// src/components/ThemeCredit.astro. The tracking parameters let the author see
// which sites send visitors; the site's own hostname is appended as utm_content.
export const credit = {
  enabled: true,
  label: 'Theme by Sv3n',
  url: 'https://sv3n.dev/',
  utm: { utm_source: 'astro-boutique', utm_medium: 'theme', utm_campaign: 'footer-credit' },
};
