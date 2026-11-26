import { expect, test } from '@playwright/test';

const paths = ['', 'about', 'integrations', 'integrations/editor', 'docs', 'showcase'];

for (const locale of ['', 'pt-br/']) {
  for (const path of paths) {
    const url = path ? `${locale}${path}` : locale.replace(/\/$/, '');
    test(`renders ${url || '/'}`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBeLessThan(400);
      const html = await page.content();
      expect(html).not.toContain('/toolkit/toolkit');
      expect(html).not.toContain(['terminalnoir', 'web.app'].join('.'));
    });
  }
}
