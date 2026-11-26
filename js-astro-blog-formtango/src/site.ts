// Everything that names the site or its author. Change these first.

export const SITE = {
  title: 'Galley',
  tagline: 'Notes on making websites by hand.',
  description:
    'Galley is a notebook about making websites by hand: typography, forms, plain HTML and the small decisions that add up to a good page.',
  author: 'Odette Marlow',
  authorBio:
    'Odette Marlow is an independent web designer who builds small, sturdy sites for bookshops, bakeries and other people with better things to do than update plugins.',
  lang: 'en-US',
  locale: 'en-US',
} as const;

export const NAV = [
  { label: 'Posts', href: '/' },
  { label: 'Tags', href: '/tags/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;
