import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('project uses the AstroArabia identity', async () => {
  const packageJson = JSON.parse(await read('package.json'));
  const layout = await read('src/layouts/BaseLayout.astro');
  assert.equal(packageJson.name, 'astroarabia');
  assert.match(layout, /<html lang="ar" dir="rtl">/);
});

test('the first complete demo and RTL styles exist', async () => {
  const agency = await read('src/pages/agency/index.astro');
  const styles = await read('src/styles/global.css');
  assert.match(agency, /QuoteForm/);
  assert.match(styles, /direction: rtl/);
  assert.match(styles, /--font-heading/);
});

test('documentation and the second preset are wired', async () => {
  const docs = await read('src/pages/docs/index.astro');
  const saas = await read('src/pages/saas/index.astro');
  const header = await read('src/components/SiteHeader.astro');
  assert.match(docs, /dir="ltr"/);
  assert.match(saas, /الأكثر اختياراً/);
  assert.match(header, /href: '\/docs'/);
  assert.match(header, /href: '\/saas'/);
  assert.match(header, /التنقل للجوال/);
  assert.match(header, /aria-current/);
  assert.match(header, /data-theme-toggle/);
  const footer = await read('src/components/SiteFooter.astro');
  assert.match(footer, /روابط النماذج/);
  assert.match(footer, /الخصوصية/);
  assert.match(footer, /LICENSE.txt/);
});

test('the portfolio and landing presets are available', async () => {
  const portfolio = await read('src/pages/portfolio/index.astro');
  const landing = await read('src/pages/landing/index.astro');
  assert.match(portfolio, /أمثلة توضيحية/);
  assert.match(landing, /باقة الإطلاق/);
});

test('SEO defaults and sitemap are configured', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  const config = await read('astro.config.mjs');
  const robots = await read('public/robots.txt');
  assert.match(layout, /rel="canonical"/);
  assert.match(layout, /og:title/);
  assert.match(config, /sitemap\(\)/);
  assert.match(config, /https:\/\/example\.com/);
  assert.match(robots, /https:\/\/example\.com\/sitemap-index\.xml/);
});

test('global contact and legal pages are available', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  const whatsapp = await read('src/components/WhatsAppFloat.astro');
  const privacy = await read('src/pages/privacy.astro');
  const terms = await read('src/pages/terms.astro');
  assert.match(layout, /WhatsAppFloat/);
  assert.match(whatsapp, /PUBLIC_WHATSAPP_NUMBER/);
  assert.match(whatsapp, /whatsappUrl &&/);
  assert.doesNotMatch(whatsapp, /966500000000/);
  assert.match(privacy, /سياسة الخصوصية/);
  assert.match(terms, /الشروط والأحكام/);
});

test('Arabic blog content is wired', async () => {
  const blogIndex = await read('src/pages/blog/index.astro');
  const blogArticle = await read('src/pages/blog/[...slug].astro');
  const contentConfig = await read('src/content.config.ts');
  const post = await read('src/content/blog/rtl-first.md');
  const stackPost = await read('src/content/blog/the-stack.md');
  const header = await read('src/components/SiteHeader.astro');
  const article = await read('src/pages/blog/[...slug].astro');
  const config = await read('astro.config.mjs');
  assert.match(blogIndex, /getCollection\('blog'\)/);
  assert.match(blogArticle, /getStaticPaths/);
  assert.match(contentConfig, /defineCollection/);
  assert.match(post, /لماذا يبدأ الموقع العربي من RTL/);
  assert.match(stackPost, /ما الذي يشغّل AstroArabia/);
  assert.match(header, /href: '\/blog'/);
  assert.match(article, /SocialShare/);
  assert.match(article, /اقرأ المزيد/);
  assert.match(article, /saasTeamImage/);
  assert.match(config, /astroToc/);
  assert.doesNotMatch(config, /purgecss/);
});

test('Google integrations are optional and environment-driven', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  const envExample = await read('.env.example');
  assert.match(layout, /PUBLIC_GOOGLE_SITE_VERIFICATION/);
  assert.match(layout, /PUBLIC_GA_ID/);
  assert.match(envExample, /PUBLIC_GA_ID/);
});

test('dark theme styles use stable selectors', async () => {
  const config = await read('astro.config.mjs');
  const styles = await read('src/styles/global.css');
  assert.doesNotMatch(config, /purgecss/);
  assert.match(styles, /:root\[data-theme='dark'\]/);
  assert.match(styles, /\.page-main-dark/);
  assert.match(styles, /\.site-header-dark/);
  assert.match(styles, /\.site-footer-dark/);
});

test('template-only actions do not send visitor data by default', async () => {
  const quoteForm = await read('src/components/QuoteForm.astro');
  assert.match(quoteForm, /<Button type="button"/);
  assert.match(quoteForm, /واجهة فقط/);
});

test('demo-facing links use safe generic destinations', async () => {
  const home = await read('src/pages/index.astro');
  const footer = await read('src/components/SiteFooter.astro');
  const docs = await read('src/pages/docs/index.astro');
  assert.match(home, /href="\/docs#quick-start"/);
  assert.match(home, />ابدأ من التوثيق</);
  assert.match(footer, /href="\/docs#new-preset"/);
  assert.match(docs, /href="\/docs#new-preset"/);
});

test('demo contact details stay generic and non-personalized', async () => {
  const envExample = await read('.env.example');
  const agency = await read('src/pages/agency/index.astro');
  const portfolio = await read('src/pages/portfolio/index.astro');
  assert.match(envExample, /PUBLIC_WHATSAPP_NUMBER=$/m);
  assert.match(agency, /hello@example\.com/);
  assert.match(portfolio, /hello@example\.com/);
  assert.doesNotMatch(agency, /hello@astroarabia\.dev/);
  assert.doesNotMatch(portfolio, /hello@astroarabia\.dev/);
  assert.doesNotMatch(portfolio, /أساعد الفرق/);
});

test('both README files document the current theme starter and developer toolchain', async () => {
  const arabicReadme = await read('README.md');
  const englishReadme = await read('README.en.md');
  for (const readme of [arabicReadme, englishReadme]) {
    assert.match(readme, /--template almahers\/astroarabia/);
    assert.match(readme, /22\.12\.0/);
    assert.match(readme, /7\.2\.9/);
    assert.match(readme, /4\.3\.3/);
    assert.match(readme, /format:check/);
  }
  assert.match(arabicReadme, /ثيم \(Theme\)/);
  assert.match(englishReadme, /Astro theme starter/);
});

test('README files use their matching localized interface previews', async () => {
  const arabicReadme = await read('README.md');
  const englishReadme = await read('README.en.md');
  assert.match(arabicReadme, /astroarabia-preview-ar\.png/);
  assert.match(englishReadme, /astroarabia-preview-en\.png/);
});

test('llms.txt provides a title and useful Markdown links for AI agents', async () => {
  const llms = await read('public/llms.txt');
  assert.match(llms, /^# AstroArabia/m);
  assert.match(llms, /\[[^\]]+\]\(https:\/\//);
});

test('GitHub community files provide conduct, security, and contribution templates', async () => {
  const codeOfConduct = await read('CODE_OF_CONDUCT.md');
  const security = await read('SECURITY.md');
  const bugReport = await read('.github/ISSUE_TEMPLATE/bug_report.md');
  const featureRequest = await read('.github/ISSUE_TEMPLATE/feature_request.md');
  const pullRequest = await read('.github/PULL_REQUEST_TEMPLATE.md');
  assert.match(codeOfConduct, /^# Code of Conduct/m);
  assert.match(security, /^# Security Policy/m);
  assert.match(bugReport, /^name: Bug report/m);
  assert.match(featureRequest, /^name: Feature request/m);
  assert.match(pullRequest, /^## Summary/m);
});
