/**
 * Inline icon set drawn for Craftline on a 24×24 grid (stroke icons, 1.75px).
 * No icon font and no third-party icon license: add your own by appending markup here.
 */
export const ICONS = {
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  "chevron-right": '<path d="m9 6 6 6-6 6"/>',
  phone:
    '<path d="M5 4h3.2l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 6.7 6.7l1.4-2.1 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16 16 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.8 7 8.2 6.2L20.2 7"/>',
  "map-pin": '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  star: '<path fill="currentColor" stroke="none" d="m12 2.8 2.8 5.9 6.4.7-4.8 4.4 1.3 6.4L12 17l-5.7 3.2 1.3-6.4-4.8-4.4 6.4-.7z"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  facebook:
    '<path fill="currentColor" stroke="none" d="M13.6 21v-7.4h2.5l.4-2.9h-2.9V8.9c0-.8.2-1.4 1.4-1.4h1.6V4.9a21 21 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2H8v2.9h2.5V21z"/>',
  instagram:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
  youtube:
    '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path fill="currentColor" stroke="none" d="M10.2 9.2v5.6l4.8-2.8z"/>',
} as const;

export type IconName = keyof typeof ICONS;
