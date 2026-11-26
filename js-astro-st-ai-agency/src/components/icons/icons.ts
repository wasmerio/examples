/**
 * Custom SVG icon set from the original ST AI Agency design.
 * Every icon draws with `currentColor`, so its color follows the CSS `color`
 * of the element it sits in. Add your own by appending to this map.
 */
export interface IconDefinition {
  viewBox: string;
  /** Default rendered size in px. */
  size: number;
  body: string;
}

export const icons = {
  clock: {
    viewBox: '0 0 16 16',
    size: 15,
    body: '<circle cx="8" cy="8" r="6.6" stroke="currentColor" stroke-width="1.3"/><path d="M8 4.4V8l2.6 1.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  'shield-check': {
    viewBox: '0 0 16 16',
    size: 15,
    body: '<path d="M8 1.9 14 4.5v4.2c0 3.5-2.4 5.7-6 6.9-3.6-1.2-6-3.4-6-6.9V4.5L8 1.9Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="m5.5 8.2 1.8 1.8L11 6.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  bars: {
    viewBox: '0 0 16 16',
    size: 15,
    body: '<path d="M2.6 13.4V6.6M6.4 13.4V3.4M10.2 13.4v-5M14 13.4V5.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
  'arrow-up-right': {
    viewBox: '0 0 18 18',
    size: 17,
    body: '<path d="M4 14 14 4M6.5 4H14v7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'arrow-right': {
    viewBox: '0 0 16 16',
    size: 15,
    body: '<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'arrow-left': {
    viewBox: '0 0 16 16',
    size: 15,
    body: '<path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'check-circle': {
    viewBox: '0 0 20 20',
    size: 19,
    body: '<circle cx="10" cy="10" r="9.2" stroke="currentColor" stroke-width="1.3"/><path d="m6 10.2 2.9 2.8L14 7.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  check: {
    viewBox: '0 0 16 16',
    size: 16,
    body: '<path d="m3 8.3 3 2.9L13 4.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  plus: {
    viewBox: '0 0 12 12',
    size: 12,
    body: '<line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  },
  mail: {
    viewBox: '0 0 24 24',
    size: 20,
    body: '<rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="m4 8 8 5 8-5" stroke="currentColor" stroke-width="1.5"/>',
  },
  phone: {
    viewBox: '0 0 24 24',
    size: 20,
    body: '<path d="M5.5 3.5h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15.5 12.5l5 2v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.7 2 2 0 0 1 5.5 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  },
  pin: {
    viewBox: '0 0 24 24',
    size: 20,
    body: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" stroke-width="1.5"/>',
  },
  time: {
    viewBox: '0 0 24 24',
    size: 20,
    body: '<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5.2l3.4 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  },
  linkedin: {
    viewBox: '0 0 24 24',
    size: 17,
    body: '<rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5"/><path d="M8 10.5v6M8 7.6v.1M12 16.5v-3.4a2 2 0 0 1 4 0v3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  },
  x: {
    viewBox: '0 0 24 24',
    size: 17,
    body: '<path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  },
  github: {
    viewBox: '0 0 24 24',
    size: 17,
    body: '<path d="M9.5 20c-4 1.2-4-2.3-5.5-3m11 5v-3.6a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5 5 0 0 0-1.4-3.5 4.7 4.7 0 0 0-.1-3.5s-1.1-.3-3.6 1.4a12.3 12.3 0 0 0-6.4 0C6.1 2.1 5 2.4 5 2.4a4.7 4.7 0 0 0-.1 3.5A5 5 0 0 0 3.5 9.5c0 5 3 6.2 6 6.6a3 3 0 0 0-.9 2.3V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  rss: {
    viewBox: '0 0 24 24',
    size: 17,
    body: '<path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="6" cy="18" r="2" fill="currentColor"/>',
  },
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;
