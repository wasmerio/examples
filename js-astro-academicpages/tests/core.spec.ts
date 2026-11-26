import { expect, test } from '@playwright/test';

import { siteConfig } from '@data/siteConfig';

import { attachAssetErrorListener, toUrl } from './fixtures/test-utils';

test.describe('Core UI, SEO & Page Integrity Tests', () => {
  test('homepage renders correctly with title and article heading', async ({
    page,
  }) => {
    const assetErrors: string[] = [];
    attachAssetErrorListener(page, assetErrors);

    await page.goto(toUrl('/'));
    await expect(page).toHaveTitle(/Academic Pages|Your Name/);
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    expect(
      assetErrors,
      'Homepage should load without failed assets or console errors'
    ).toEqual([]);
  });

  test('masthead navigation renders brand and nav items', async ({
    page,
    isMobile,
  }) => {
    await page.goto(toUrl('/'));
    const brand = page.locator('header a', { hasText: 'Your Name' }).first();
    await expect(brand).toBeVisible();

    if (!isMobile) {
      const pubLink = page.locator('nav a', { hasText: 'Publications' });
      await expect(pubLink).toBeVisible();
      const talksLink = page.locator('nav a', { hasText: 'Talks' });
      await expect(talksLink).toBeVisible();
    } else {
      const menuBtn = page.locator('#mobile-nav-toggle');
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();
      const mobilePubLink = page.locator('#mobile-menu a', {
        hasText: 'Publications',
      });
      await expect(mobilePubLink).toBeVisible();
    }
  });

  test('author profile renders avatar, bio, and verified links', async ({
    page,
  }) => {
    await page.goto(toUrl('/'));
    const authorName = page.locator('h3', { hasText: siteConfig.author.name });
    await expect(authorName).toBeVisible();
    const avatar = page.locator('.author__avatar img');
    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAttribute('alt', siteConfig.author.name);
  });

  test('footer renders copyright, follow links, sitemap, and terms link', async ({
    page,
  }) => {
    await page.goto(toUrl('/'));
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Powered by');
    await expect(footer).toContainText('Sitemap');
    await expect(footer).toContainText('Terms & Privacy Policy');
  });

  test('semantic landmarks and accessibility checks', async ({ page }) => {
    await page.goto(toUrl('/'));
    await expect(page.locator('a[href="#main-content"]')).toHaveText(
      'Skip to content'
    );
    await expect(page.locator('#main-content')).toBeAttached();
    await expect(page.locator('header').first()).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('404 page renders properly', async ({ page }) => {
    const response = await page.goto(toUrl('/404.html'));
    expect([200, 404]).toContain(response?.status());
    const h1 = page.locator('h1', { hasText: 'Page Not Found' });
    await expect(h1).toBeVisible();
  });

  const archiveRoutes = [
    { path: toUrl('/publications/'), title: 'Publications' },
    { path: toUrl('/talks/'), title: 'Talks' },
    { path: toUrl('/teaching/'), title: 'Teaching' },
    { path: toUrl('/portfolio/'), title: 'Portfolio' },
    { path: toUrl('/posts/'), title: 'Blog Posts' },
    { path: toUrl('/cv/'), title: 'CV' },
    { path: toUrl('/markdown/'), title: 'Markdown' },
    { path: toUrl('/sitemap/'), title: 'Sitemap' },
  ];

  for (const route of archiveRoutes) {
    test(`archive route renders correctly: ${route.path}`, async ({ page }) => {
      const assetErrors: string[] = [];
      attachAssetErrorListener(page, assetErrors);

      await page.goto(route.path);
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      expect(
        assetErrors,
        `Route ${route.path} should load with 0 asset errors`
      ).toEqual([]);
    });
  }

  const singleRoutes = [
    toUrl('/posts/blog-post-1/'),
    toUrl('/posts/first-post/'),
    toUrl('/publications/paper-1/'),
    toUrl('/talks/talk-1/'),
    toUrl('/teaching/teaching-1/'),
    toUrl('/portfolio/portfolio-1/'),
  ];

  for (const singlePath of singleRoutes) {
    test(`single item page renders correctly: ${singlePath}`, async ({
      page,
    }) => {
      const assetErrors: string[] = [];
      attachAssetErrorListener(page, assetErrors);

      await page.goto(singlePath);
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      expect(
        assetErrors,
        `Single route ${singlePath} should load with 0 asset errors`
      ).toEqual([]);
    });
  }

  test('canonical URL and OpenGraph meta tags match page URL', async ({
    page,
  }) => {
    await page.goto(toUrl('/publications/'));
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /publications\/?$/);

    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute('content', /publications\/?$/);
  });

  test('external social, project, and markdown links enforce target="_blank"', async ({
    page,
  }) => {
    await page.goto(toUrl('/'));
    const authorExternalLinks = page.locator('.author__urls a[href^="http"]');
    const authorCount = await authorExternalLinks.count();
    expect(authorCount).toBeGreaterThan(0);

    for (let i = 0; i < authorCount; i++) {
      const link = authorExternalLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      const rel = await link.getAttribute('rel');
      expect(rel).toBeNull();
    }

    const footerCreditLinks = page.locator('footer p a[href^="http"]');
    const creditCount = await footerCreditLinks.count();
    expect(creditCount).toBeGreaterThan(0);

    for (let i = 0; i < creditCount; i++) {
      const link = footerCreditLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'nofollow');
    }

    await page.goto(toUrl('/markdown/'));
    const markdownExternalLinks = page.locator(
      '.prose a[href^="http://"], .prose a[href^="https://"]'
    );
    const mdCount = await markdownExternalLinks.count();
    expect(mdCount).toBeGreaterThan(0);

    for (let i = 0; i < mdCount; i++) {
      const link = markdownExternalLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      const rel = await link.getAttribute('rel');
      expect(rel).toBeNull();
      const srCue = link.locator('.sr-only');
      await expect(srCue).toContainText('(opens in a new tab)');
    }
  });

  test('print stylesheet hides masthead, footer, search, and interactive controls', async ({
    page,
  }) => {
    await page.goto(toUrl('/cv/'));
    await page.emulateMedia({ media: 'print' });

    const masthead = page.locator('header.sticky, header:has(nav)').first();
    const footer = page.locator('footer');
    const searchBtn = page.locator('.search-trigger-btn').first();
    const toc = page.locator('#toc-wrapper');

    await expect(masthead).toHaveCSS('display', 'none');
    await expect(footer).toHaveCSS('display', 'none');
    await expect(searchBtn).toHaveCSS('display', 'none');
    await expect(toc).toHaveCSS('display', 'none');
  });

  test('Google Scholar and Highwire Press academic meta tags render on publication pages', async ({
    page,
  }) => {
    await page.goto(toUrl('/publications/paper-1/'));
    const citationTitle = page.locator('meta[name="citation_title"]');
    await expect(citationTitle).toHaveAttribute(
      'content',
      'Paper Title Number 1'
    );

    const citationAuthor = page.locator('meta[name="citation_author"]');
    await expect(citationAuthor).toHaveAttribute(
      'content',
      siteConfig.author.name
    );

    const citationDate = page.locator('meta[name="citation_publication_date"]');
    await expect(citationDate).toHaveAttribute('content', '2024-03-15');
  });

  test('siteConfig locale, breadcrumbs, and Scholar profile link are properly wired', async ({
    page,
  }) => {
    await page.goto(toUrl('/'));
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      siteConfig.locale
    );

    await page.goto(toUrl('/publications/'));
    const scholarLink = page.locator('a', {
      hasText: 'my Google Scholar profile',
    });
    await expect(scholarLink).toBeVisible();
    await expect(scholarLink).toHaveAttribute(
      'href',
      /^https:\/\/scholar\.google\.com\/citations\?user=/
    );
  });

  test('OpenGraph metadata standards are fully rendered', async ({
    page,
    request,
  }) => {
    await page.goto(toUrl('/publications/paper-1/'));

    const ogSiteName = page.locator('meta[property="og:site_name"]');
    await expect(ogSiteName).toHaveAttribute('content', siteConfig.title);

    const ogLocale = page.locator('meta[property="og:locale"]');
    await expect(ogLocale).toHaveAttribute(
      'content',
      siteConfig.locale.replace('-', '_')
    );

    const ogRoutes = [
      toUrl('/'),
      toUrl('/publications/paper-1/'),
      toUrl('/teaching/teaching-1/'),
      toUrl('/cv/'),
      toUrl('/markdown/'),
    ];

    for (const route of ogRoutes) {
      await page.goto(route);
      const ogImage = await page
        .locator('meta[property="og:image"]')
        .getAttribute('content');
      expect(ogImage).toBeTruthy();
      const ogPath = new URL(ogImage!).pathname;
      const res = await request.get(ogPath);
      expect(res.status(), `OG image at ${ogPath} should return 200`).toBe(200);
    }
  });

  test('JSON-LD schema.org graphs render expected entities across content types', async ({
    page,
  }) => {
    await page.goto(toUrl('/'));
    const homeJsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(homeJsonLdText).toBeTruthy();
    const homeJsonLd = JSON.parse(homeJsonLdText!);
    const homeGraph = homeJsonLd['@graph'] as {
      '@type': string;
      sameAs?: string[];
    }[];
    const homeTypes = homeGraph.map((n) => n['@type']);
    expect(homeTypes).toContain('WebSite');
    expect(homeTypes).toContain('Person');
    expect(homeTypes).toContain('ProfilePage');

    const personNode = homeGraph.find((n) => n['@type'] === 'Person');
    expect(personNode?.sameAs?.length).toBeGreaterThan(0);
    for (const url of personNode?.sameAs ?? []) {
      expect(url).toMatch(/^https:\/\//);
      expect(url).not.toMatch(/^https:\/\/.*https:\/\//);
    }

    await page.goto(toUrl('/publications/paper-1/'));
    const pubJsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const pubJsonLd = JSON.parse(pubJsonLdText!);
    const pubTypes = (pubJsonLd['@graph'] as { '@type': string }[]).map(
      (n) => n['@type']
    );
    expect(pubTypes).toContain('ScholarlyArticle');

    await page.goto(toUrl('/talks/talk-1/'));
    const talkJsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const talkJsonLd = JSON.parse(talkJsonLdText!);
    const talkTypes = (talkJsonLd['@graph'] as { '@type': string }[]).map(
      (n) => n['@type']
    );
    expect(talkTypes).toContain('EducationEvent');

    await page.goto(toUrl('/teaching/teaching-1/'));
    const teachJsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const teachJsonLd = JSON.parse(teachJsonLdText!);
    const teachTypes = (teachJsonLd['@graph'] as { '@type': string }[]).map(
      (n) => n['@type']
    );
    expect(teachTypes).toContain('Course');

    await page.goto(toUrl('/posts/blog-post-1/'));
    const postJsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const postJsonLd = JSON.parse(postJsonLdText!);
    const postTypes = (postJsonLd['@graph'] as { '@type': string }[]).map(
      (n) => n['@type']
    );
    expect(postTypes).toContain('BlogPosting');

    await page.goto(toUrl('/portfolio/portfolio-1/'));
    const portJsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    const portJsonLd = JSON.parse(portJsonLdText!);
    const portTypes = (portJsonLd['@graph'] as { '@type': string }[]).map(
      (n) => n['@type']
    );
    expect(
      portTypes.includes('CreativeWork') ||
        portTypes.includes('SoftwareSourceCode')
    ).toBe(true);
  });

  test('static route redirects work properly (/guide, /md -> /markdown/)', async ({
    page,
  }) => {
    await page.goto(toUrl('/guide/'));
    await expect(page).toHaveURL(/.*\/markdown\/?$/);

    await page.goto(toUrl('/md/'));
    await expect(page).toHaveURL(/.*\/markdown\/?$/);
  });
});
