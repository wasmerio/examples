/**
 * Inline icon set drawn for Orrery on a 24×24 grid (stroke icons, 1.5px).
 * No icon font and no third-party icon license: add your own by appending markup here.
 */
export const ICONS = {
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  "arrow-up-right": '<path d="M7 17 17 7M8 7h9v9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  phone:
    '<path d="M5 4h3.2l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 6.7 6.7l1.4-2.1 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16 16 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.8 7 8.2 6.2L20.2 7"/>',
  "map-pin": '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  linkedin:
    '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M8 7.2v.1M12 17v-3.8c0-1.6 1-2.7 2.4-2.7s2.1 1 2.1 2.7V17M12 10.5V17"/>',
  github:
    '<path d="M9 19c-4 1.3-4-2-5.6-2.5M14.6 21v-3.2a2.8 2.8 0 0 0-.8-2.2c2.6-.3 5.4-1.3 5.4-5.8a4.5 4.5 0 0 0-1.2-3.1 4.2 4.2 0 0 0-.1-3.1s-1-.3-3.3 1.2a11.4 11.4 0 0 0-6 0C6.3 3.3 5.3 3.6 5.3 3.6a4.2 4.2 0 0 0-.1 3.1A4.5 4.5 0 0 0 4 9.8c0 4.5 2.7 5.5 5.4 5.8a2.8 2.8 0 0 0-.8 2.2V21"/>',
} as const;

export type IconName = keyof typeof ICONS;
