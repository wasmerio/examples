import { describe, expect, it } from 'vitest';
import {
  company,
  privacyPage,
  seo,
  site,
} from './index';

describe('public data contracts', () => {
  it('loads the core site data through the runtime schemas', () => {
    expect(site.name).toBeTruthy();
    expect(site.locale).toMatch(/^[a-z]{2}$/);
    expect(company.email).toContain('@');
    expect(seo.defaultTitle).toBeTruthy();
  });

  it('loads the retained privacy content through the page schema', () => {
    expect(privacyPage.seo.title).toBeTruthy();
    expect(privacyPage.title).toBeTruthy();
    expect(privacyPage.sections.length).toBeGreaterThan(0);
  });
});
