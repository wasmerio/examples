// Unit tests for src/lib/media.ts (media + icon spec normalization).

import { describe, it, expect } from 'vitest';
import {
  githubAvatarUrl,
  toMediaSpec,
  toIconSpec,
  iconSvgProps,
} from '../src/lib/media';

describe('githubAvatarUrl', () => {
  it('builds a 2x Retina URL capped at GitHub\'s 460px limit', () => {
    expect(githubAvatarUrl('vitejs', 48)).toBe('https://github.com/vitejs.png?size=96');
  });

  it('caps the requested size at 460', () => {
    expect(githubAvatarUrl('vitejs', 300)).toBe('https://github.com/vitejs.png?size=460');
  });

  it('encodes usernames', () => {
    expect(githubAvatarUrl('a b', 20)).toBe('https://github.com/a%20b.png?size=40');
  });
});

describe('toMediaSpec', () => {
  it('turns a string shorthand into { src }', () => {
    expect(toMediaSpec('/img/logo.png')).toEqual({ src: '/img/logo.png' });
  });

  it('passes objects through unchanged', () => {
    const spec = { github: 'vitejs', fallback: 'V' };
    expect(toMediaSpec(spec)).toBe(spec);
  });

  it('returns undefined for null/undefined', () => {
    expect(toMediaSpec(null)).toBeUndefined();
    expect(toMediaSpec(undefined)).toBeUndefined();
  });
});

describe('toIconSpec', () => {
  it('turns a string shorthand into a single-path icon', () => {
    expect(toIconSpec('M0 0')).toEqual({ paths: ['M0 0'] });
  });

  it('passes objects through unchanged', () => {
    const icon = { paths: ['M1', 'M2'], variant: 'filled' as const };
    expect(toIconSpec(icon)).toBe(icon);
  });

  it('returns undefined for null/undefined', () => {
    expect(toIconSpec(null)).toBeUndefined();
    expect(toIconSpec(undefined)).toBeUndefined();
  });
});

describe('iconSvgProps', () => {
  it('renders outline defaults', () => {
    expect(iconSvgProps({ paths: ['M0'] })).toEqual({
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.5,
    });
  });

  it('honors a custom stroke width', () => {
    expect(iconSvgProps({ paths: ['M0'], strokeWidth: 2 }).strokeWidth).toBe(2);
  });

  it('renders filled variants without stroke', () => {
    const p = iconSvgProps({ paths: ['M0'], variant: 'filled' });
    expect(p.fill).toBe('currentColor');
    expect(p.stroke).toBe('none');
  });
});
