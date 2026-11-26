// Unit tests for src/lib/docs.ts sidebar nav builder.

import { describe, it, expect } from 'vitest';
import { buildNav } from '../src/lib/docs';

describe('buildNav', () => {
  const docs = [
    { id: 'getting-started', data: { title: 'Getting Started', order: 1 } },
    { id: 'index', data: { title: 'Overview', order: 99 } },
    { id: 'api', data: { title: 'API Reference', order: 2 } },
    { id: 'troubleshooting', data: { title: 'Troubleshooting', order: 0 } },
  ];

  it('puts index first regardless of order', () => {
    const nav = buildNav(docs, '/vite/docs');
    expect(nav.map((n) => n.label)).toEqual(['Overview', 'Troubleshooting', 'Getting Started', 'API Reference']);
  });

  it('maps index to the collection base and others to /base/<id>', () => {
    const nav = buildNav(docs, '/vite/docs');
    expect(nav[0]).toEqual({ href: '/vite/docs', label: 'Overview' });
    expect(nav[1].href).toBe('/vite/docs/troubleshooting');
  });

  it('sorts by explicit order then by title', () => {
    const nav = buildNav(docs, '/vite/docs');
    // After index: order 0 (Troubleshooting), 1 (Getting Started), 2 (API Reference).
    expect(nav.slice(1).map((n) => n.label)).toEqual(['Troubleshooting', 'Getting Started', 'API Reference']);
  });

  it('falls back to title sort when orders tie', () => {
    const tied = [
      { id: 'zeta', data: { title: 'Zeta', order: 0 } },
      { id: 'alpha', data: { title: 'Alpha', order: 0 } },
    ];
    const nav = buildNav(tied, '/p/docs');
    expect(nav.map((n) => n.label)).toEqual(['Alpha', 'Zeta']);
  });

  it('handles an empty collection', () => {
    expect(buildNav([], '/p/docs')).toEqual([]);
  });

  it('does not mutate the input order', () => {
    const input = [...docs];
    buildNav(input, '/vite/docs');
    expect(input.map((d) => d.id)).toEqual(['getting-started', 'index', 'api', 'troubleshooting']);
  });
});
