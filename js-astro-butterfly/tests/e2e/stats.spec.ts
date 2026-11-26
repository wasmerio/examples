import { expect, test, type Page } from '@playwright/test';

const api = 'https://busuanzi.ibruce.info/busuanzi?*';
const postApi = 'https://cdn.busuanzi.cc/api.php';
const selfHostedApi = 'https://stats.refrain.site/api/count';

async function mockCounters(page: Page, origin: string, provider = '', endpoint = '') {
  await page.route((url) => url.origin !== origin, (route) => route.abort());
  await page.route((url) => url.origin === origin && ['/', '/archives/'].includes(url.pathname), async (route) => {
    const response = await route.fetch();
    const body = (await response.text())
      .replace(/<body\b([^>]*)>/, (_, attrs: string) =>
        `<body${attrs.replace(/\sdata-(?:busuanzi|stats-endpoint)(?:="[^"]*")?/g, '')} data-busuanzi="${provider}"${endpoint ? ` data-stats-endpoint="${endpoint}"` : ''}>`)
      .replace('</main>', [
        '<a href="#test-visits" id="test-anchor">Go to counter</a>',
        '<span id="test-visits" data-bsz="page_pv" aria-busy="true">…</span>',
        '<span id="test-visitors" data-bsz="site_uv" aria-busy="true">…</span>',
        '<span id="test-site-views" data-bsz="site_pv" aria-busy="true">…</span>',
        '</main>',
      ].join(''));
    await route.fulfill({ response, body });
  });
}

test('self-hosted stats retry the same view and record each Astro navigation once @mobile', async ({ page, baseURL, isMobile }) => {
  const origin = new URL(baseURL!).origin;
  const requests: Array<{ path: string; request_id: string }> = [];
  await mockCounters(page, origin, '', selfHostedApi);
  await page.route(selfHostedApi, async (route) => {
    const request = route.request();
    expect(request.method()).toBe('POST');
    requests.push(request.postDataJSON());
    await route.fulfill({
      status: requests.length === 1 ? 502 : requests.length === 4 ? 503 : 200,
      headers: { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true' },
      json: { site_pv: 345, site_uv: 20, page_pv: requests.length },
    });
  });
  await page.goto('/?campaign=testing#missing-counter-anchor');
  await expect(page.locator('#test-visits')).toHaveText('2');
  expect(requests[0]).toEqual(requests[1]);
  expect(requests[0].path).toBe('/');
  if (isMobile) {
    await page.getByRole('button', { name: '打开菜单' }).click();
    await page.locator('#sidebar .sidebar-links a[href="/archives/"]').click();
  } else {
    await page.locator('#nav a[href="/archives/"]').click();
  }
  await expect(page.locator('#test-visits')).toHaveText('3');
  await page.locator('#test-anchor').click();
  await page.goBack();
  expect(requests).toHaveLength(3);
  await page.goBack();
  await expect(page.locator('#test-visits')).toHaveText('—');
  expect(requests.map(({ path }) => path)).toEqual(['/', '/', '/archives/', '/']);
  expect(new Set(requests.map(({ request_id }) => request_id)).size).toBe(3);
});

test('busuanzi.cc sends one POST per Astro page and excludes query strings and fragments', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await mockCounters(page, origin, 'busuanzi.cc');

  let markRequested!: () => void;
  const firstRequested = new Promise<void>((resolve) => { markRequested = resolve; });
  let releaseFirst!: () => void;
  const firstMayReply = new Promise<void>((resolve) => { releaseFirst = resolve; });
  const requests: string[] = [];
  await page.route(postApi, async (route) => {
    const request = route.request();
    const { url, referrer } = JSON.parse(request.postData()!);
    expect(request.method()).toBe('POST');
    expect(request.headers()['content-type']).toMatch(/^text\/plain/);
    expect(request.headers().referer).toBeUndefined();
    expect(referrer).toBe('');
    requests.push(url);
    const firstPage = requests.length === 1;
    if (firstPage) {
      markRequested();
      await firstMayReply;
    }
    await route.fulfill({
      headers: { 'access-control-allow-origin': '*' },
      json: { busuanzi_page_pv: firstPage ? '111' : '222', busuanzi_site_pv: '1234', busuanzi_site_uv: 0 },
    });
  });

  try {
    await page.goto('/?campaign=testing#test-visits', { waitUntil: 'domcontentloaded' });
    await firstRequested;
    await page.locator('#nav a[href="/archives/"]').evaluate((link: HTMLAnchorElement) => link.click());
    await expect(page).toHaveURL(`${origin}/archives/`);
    await expect(page.locator('#test-visits')).toHaveText('222');
    await expect(page.locator('#test-site-views')).toHaveText('1,234');
    await expect(page.locator('#test-visitors')).toHaveText('0');
    releaseFirst();

    await page.locator('#test-anchor').click();
    await expect(page).toHaveURL(`${origin}/archives/#test-visits`);
    await expect(page.locator('#test-visits')).toHaveText('222');
    expect(requests).toEqual([`${origin}/`, `${origin}/archives/`]);
  } finally {
    releaseFirst();
  }
});

test('busuanzi.cc clears the loading state when the service returns an error', async ({ page, baseURL }) => {
  await mockCounters(page, new URL(baseURL!).origin, 'busuanzi.cc');
  await page.route(postApi, (route) => route.fulfill({
    status: 503,
    headers: { 'access-control-allow-origin': '*' },
  }));

  await page.goto('/');
  await expect(page.locator('#test-visits')).toHaveText('—', { timeout: 3000 });
  await expect(page.locator('#test-visitors')).toHaveText('—');
  await expect(page.locator('#test-site-views')).toHaveText('—');
  await expect(page.locator('#test-visits, #test-visitors, #test-site-views').and(page.locator('[aria-busy]'))).toHaveCount(0);
});

test('counts each Astro page once and releases a previous page request', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await mockCounters(page, origin);

  let markFirstRequested!: (callback: string) => void;
  const firstRequested = new Promise<string>((resolve) => { markFirstRequested = resolve; });
  let releaseFirst!: () => void;
  const firstMayReply = new Promise<void>((resolve) => { releaseFirst = resolve; });
  const requests: string[] = [];
  await page.route(api, async (route) => {
    const referer = new URL(route.request().headers().referer);
    const callback = new URL(route.request().url()).searchParams.get('jsonpCallback')!;
    requests.push(referer.pathname);
    if (referer.pathname === '/' && requests.length === 1) {
      markFirstRequested(callback);
      await firstMayReply;
      await route.fulfill({
        contentType: 'application/json',
        body: `try{${callback}({page_pv: 111});}catch(e){}`,
      });
      return;
    }
    await route.fulfill({
      contentType: 'application/json',
      body: `try{${callback}({page_pv: ${referer.pathname === '/' ? 333 : 222}, site_uv: 12, site_pv: 1234});}catch(e){}`,
    });
  });

  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const firstCallback = await firstRequested;
    await page.locator('#nav a[href="/archives/"]').click();
    await expect(page).toHaveURL(/\/archives\/$/);
    const counter = page.locator('#test-visits');
    await expect(counter).toHaveText('222');
    await expect(page.locator('#test-visitors')).toHaveText('12');
    await expect(page.locator('#test-site-views')).toHaveText('1,234');
    expect(await page.evaluate((callback) => Reflect.has(window, callback), firstCallback)).toBe(false);
    releaseFirst();

    await page.locator('#test-anchor').click();
    await expect(page).toHaveURL(/\/archives\/#test-visits$/);
    await expect(counter).toHaveText('222');
    await page.goBack();
    await expect(page).toHaveURL(/\/archives\/$/);
    await page.goBack();
    await expect(page).toHaveURL(`${origin}/`);
    await expect(page.locator('#test-visits')).toHaveText('333');
    expect(requests).toEqual(['/', '/archives/', '/']);
  } finally {
    releaseFirst();
  }
});

for (const [name, payload, expected] of [
  ['a partial response', '{page_pv: 0, site_uv: -1}', '0'],
  ['a response without a callback', null, '—'],
] as const) {
  test(`settles all counters after ${name}`, async ({ page, baseURL }) => {
    await mockCounters(page, new URL(baseURL!).origin);
    await page.route(api, async (route) => {
      const callback = new URL(route.request().url()).searchParams.get('jsonpCallback');
      await route.fulfill({
        contentType: 'application/javascript',
        body: payload ? `${callback}(${payload});` : 'void 0;',
      });
    });

    await page.goto('/');
    await expect(page.locator('#test-visits')).toHaveText(expected, { timeout: 3000 });
    await expect(page.locator('#test-visitors')).toHaveText('—', { timeout: 3000 });
    await expect(page.locator('#test-site-views')).toHaveText('—', { timeout: 3000 });
    await expect(page.locator('#test-visits, #test-visitors, #test-site-views').and(page.locator('[aria-busy]'))).toHaveCount(0);
    await expect(page.locator('script[src*="jsonpCallback"]')).toHaveCount(0);
  });
}
