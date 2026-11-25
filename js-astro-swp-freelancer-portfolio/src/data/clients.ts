import type { Client } from '~/types';

/**
 * Logos for the marquee strip. Each entry draws on a 24×24 viewBox with
 * `fill="none" stroke="currentColor" stroke-width="1.8"`, so a simple
 * path or a couple of shapes is all you need.
 */
export const clients: Client[] = [
  { name: 'Brightsill', shape: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/>' },
  { name: 'Tessellate', shape: '<path d="M4 20 12 4l8 16z"/>' },
  { name: 'Coalfield', shape: '<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M9 12h6"/>' },
  { name: 'Petrichor', shape: '<path d="M12 3.5 20 12l-8 8.5L4 12z"/>' },
  { name: 'Saltmarsh', shape: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>' },
  { name: 'Undergrove', shape: '<path d="M5 18V6l7 6 7-6v12"/>' },
  { name: 'Meridian', shape: '<circle cx="12" cy="12" r="8.5"/><path d="M7 12h10M12 7v10"/>' },
];

export const clientsLabel = 'Shipped with 30+ product teams';
