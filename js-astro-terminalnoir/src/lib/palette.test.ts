import { describe, expect, it } from 'vitest';
import { ui } from '../i18n/ui';
import { ansiColors, cssVariables, swatchGroups, VARIANTS } from './palette';

describe('swatchGroups', () => {
  it('groups surfaces, text and accents with role names and hex', () => {
    const groups = swatchGroups('dark');

    expect(groups.map(g => g.id)).toEqual(['surface', 'text', 'accent']);
    const accent = groups.find(g => g.id === 'accent');
    expect(accent?.items).toContainEqual({ role: 'accent.primary', name: 'primary', hex: '#F5A623' });
  });

  it('reads the light variant from the same roles', () => {
    const surface = swatchGroups('light').find(g => g.id === 'surface');

    expect(surface?.items[0]).toEqual({ role: 'surface.base', name: 'base', hex: '#FBFAF7' });
  });
});

describe('ansiColors', () => {
  it('lists the 16 ANSI colors in terminal order', () => {
    const colors = ansiColors('dark');

    expect(colors).toHaveLength(16);
    expect(colors[3]).toEqual({ index: 3, name: 'yellow', hex: '#F5A623' });
    expect(colors[15]).toEqual({ index: 15, name: 'bright white', hex: '#F4F4F5' });
  });
});

describe('cssVariables', () => {
  it('maps every palette role to a --tn-* custom property', () => {
    const vars = cssVariables('dark');

    expect(vars['--tn-surface-base']).toBe('#0B0B0C');
    expect(vars['--tn-accent-on-primary']).toBe('#0B0B0C');
    expect(vars['--tn-ansi-bright-cyan']).toBe('#56D4DD');
  });

  it('defines the same properties for both variants', () => {
    const [dark, light] = VARIANTS.map(v => Object.keys(cssVariables(v)).sort());

    expect(light).toEqual(dark);
  });
});

describe('role notes', () => {
  it('describes every palette role in the UI dictionary', () => {
    for (const group of swatchGroups('dark')) {
      for (const swatch of group.items) {
        expect(ui.en[`role.${swatch.role}` as keyof typeof ui.en], swatch.role).toBeTruthy();
      }
    }
  });
});
