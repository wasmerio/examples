// @env node
import { Buffer } from 'node:buffer'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const base = new URL(process.env.SHOWCASE_URL ?? 'http://127.0.0.1:4325/astro-constructivist/')
const destination = new URL('../docs/images/', import.meta.url)
const coverOnly = process.argv.includes('--cover-only')
const captures = new Map()
const outputs = new Map()
const errors = []
const viewport = { width: 1440, height: 900 }
const markSource = await readFile(new URL('../src/components/ConstructionMark.astro', import.meta.url), 'utf8')
const markGeometry = /<svg[^>]*>([\s\S]*?)<\/svg>/.exec(markSource)?.[1]
if (!markGeometry)
  throw new Error('The original ConstructionMark SVG could not be read.')
const markCss = '.construction-mark__orbit,.construction-mark__axes{stroke:currentColor;stroke-width:1;opacity:.45}.construction-mark__body,.construction-mark__point{fill:currentColor}.construction-mark__beam{fill:#f03a17}'

function progress(message) {
  console.log(`[showcase] ${message}`)
}

const fonts = [
  [
    'Anton',
    '@fontsource/anton/files/anton-latin-400-normal.woff2',
    '400',
    'normal',
  ],
  [
    'Instrument Serif',
    '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
    '400',
    'italic',
  ],
  [
    'Space Grotesk',
    '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
    '300 700',
    'normal',
  ],
  [
    'JetBrains Mono',
    '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
    '100 800',
    'normal',
  ],
]
const fontCss = (await Promise.all(fonts.map(async ([family, path, weight, style]) => {
  const bytes = await readFile(new URL(`../node_modules/${path}`, import.meta.url))
  return `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};font-display:block;src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2')}`
}))).join('')

function image(bytes) {
  return `data:image/png;base64,${bytes.toString('base64')}`
}

async function saveImage(name, bytes) {
  await writeFile(new URL(`${name}.png`, destination), bytes)
  await sharp(bytes).webp({ quality: 85, effort: 6 }).toFile(fileURLToPath(new URL(`${name}.webp`, destination)))
}

function monitorPage(page) {
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error')
      errors.push(message.text())
  })
}

async function render(browser, name, width, height, content, pixelRatio = 1) {
  progress(`Rendering ${name}`)
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: pixelRatio,
  })
  page.setDefaultTimeout(15_000)
  page.setDefaultNavigationTimeout(30_000)
  await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${fontCss}${markCss}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%}body{font-family:'Space Grotesk',sans-serif;color:#121110;background:#f2eadb}img{display:block;width:100%;height:auto}svg{display:block}</style></head><body>${content}</body></html>`)
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.fonts].map(font => font.load()))
    await Promise.all([...document.images].map(img => img.decode()))
  })
  const bytes = await page.screenshot({ type: 'png' })
  outputs.set(name, bytes)
  await page.close()
  return bytes
}

function coverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="3840" height="2160" viewBox="0 0 3840 2160">
  <defs><style>${fontCss}${markCss}text{font-kerning:normal}</style></defs>
  <path fill="#f2eadb" d="M0 0h3840v2160H0z"/>
  <path fill="#121110" d="M3208 0h632v2160h-632z"/>
  <g transform="translate(2610 310) rotate(9)">
    <path fill="#3157e7" d="M0 0h826v1048H0z"/>
    <path fill="none" stroke="#121110" stroke-width="4" d="M28 28h770v992H28z"/>
  </g>
  <g transform="translate(2650 732) rotate(-8)">
    <path fill="#d6e66b" d="M0 0h760v898H0z"/>
    <path fill="none" stroke="#121110" stroke-width="4" d="M28 28h704v842H28z"/>
  </g>
  <path fill="#f03a17" d="M2602 1005h910v1155H2158z"/>
  <path d="M168 316h2830M168 1750h2830" stroke="#121110" stroke-width="3"/>
  <g fill="#121110" font-family="JetBrains Mono" font-size="36" letter-spacing="4">
    <text x="176" y="234">CONSTRUCTIVIST ASTRO THEME</text>
    <text x="176" y="1900">ONE CV.JSON / YOUR ENTIRE PORTFOLIO</text>
  </g>
  <text x="152" y="1016" font-family="Anton" font-size="478" fill="#121110" letter-spacing="-13">CONSTRUCTA</text>
  <text x="176" y="1282" font-family="Instrument Serif" font-style="italic" font-size="169" fill="#121110">One file. Entirely yours.</text>
  <text x="182" y="1420" font-family="Space Grotesk" font-size="51" fill="#121110">A considered system. A distinct point of view.</text>
  <g fill="#121110" font-family="JetBrains Mono" font-size="29">
    <text x="182" y="1602">LAYERED ENTRANCE</text>
    <text x="832" y="1602">SECTION-DRIVEN MOTION</text>
    <text x="1662" y="1602">6 PALETTES / DARK + LIGHT</text>
  </g>
  <svg x="3324" y="186" width="400" height="400" viewBox="0 0 240 240" fill="none" color="#f2eadb">${markGeometry}</svg>
  <g fill="#f2eadb" font-family="JetBrains Mono" font-size="26" letter-spacing="3">
    <text x="3300" y="1898">ASTRO / TS / GSAP</text>
    <text x="3300" y="1970">MADE TO MAKE YOURS</text>
  </g>
  <g stroke="#121110" stroke-width="3"><path d="M140 105h72M176 69v72M2980 1935h72M3016 1899v72"/></g>
  </svg>`
}

async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.scrollReady === 'true', undefined, { timeout: 15_000 })
  await page.waitForFunction(() => !document.documentElement.dataset.loaderState || document.documentElement.dataset.loaderState === 'complete', undefined, { timeout: 15_000 })
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  if (!new URL(page.url()).hash) {
    await page.waitForFunction(() => [
      ...document.querySelectorAll('[data-hero-letter]'),
    ].every((letter) => {
      const style = getComputedStyle(letter)
      return Number(style.opacity) === 1 && (style.transform === 'none' || new DOMMatrixReadOnly(style.transform).isIdentity)
    }))
    const toggle = page.locator('[data-globe-toggle]')
    const box = await toggle.boundingBox()
    if (box && box.y >= 0 && box.y + box.height <= page.viewportSize().height && await toggle.getAttribute('aria-pressed') !== 'true')
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  }
  await page.mouse.move(-24, -24)
}

async function assertApp(page) {
  const state = await page.evaluate(() => {
    const content = document.body.textContent ?? ''
    return {
      heading: document.querySelector('#main h1')?.textContent?.trim(),
      overlay: Boolean(document.querySelector('astro-error-overlay, vite-error-overlay')),
      compilerError: content.includes('An error occurred.') && /CompilerError|Stack Trace/.test(content),
    }
  })
  if (!state.heading || state.overlay || state.compilerError)
    throw new Error(`Showcase capture rejected a blank or error page: ${JSON.stringify(state)}`)
}

async function capture(page, name) {
  progress(`Capturing ${name}`)
  await assertApp(page)
  await page.evaluate(async () => {
    const visible = [...document.images].filter((img) => {
      const bounds = img.getBoundingClientRect()
      return bounds.width > 0 && bounds.height > 0 && bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth
    })
    await Promise.race([
      Promise.all(visible.map(img => img.decode())),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Visible showcase images did not finish decoding.')), 8000)),
    ])
  })
  let bytes
  if (name === 'loader') {
    // Capture the actual plate state while the unused serif font is pending;
    // Playwright's normal screenshot waits for every font and misses this phase.
    const session = await page.context().newCDPSession(page)
    try {
      const screenshot = await session.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      })
      bytes = Buffer.from(screenshot.data, 'base64')
    }
    finally {
      await session.detach()
    }
  }
  else {
    bytes = await page.screenshot({ type: 'png' })
  }
  await assertApp(page)
  captures.set(name, bytes)
}

async function visit(page, fragment) {
  progress(`Visiting ${fragment || 'hero'}`)
  await page.goto(new URL(fragment, base).href, { waitUntil: 'domcontentloaded' })
  await ready(page)
  if (fragment) {
    await page.waitForFunction((hash) => {
      const target = document.getElementById(hash.slice(1))
      const section = target?.closest('[data-scroll-section]')
      return section?.id === document.documentElement.dataset.activeSection
    }, fragment)
    // Native anchor navigation and scrubbed timelines must settle before capture.
    await page.waitForTimeout(1800)
  }
}

async function captureTheme(browser, palette, dark) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    colorScheme: dark ? 'dark' : 'light',
  })
  await context.addInitScript(({ palette, dark }) => {
    localStorage.setItem('data-theme', palette)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, { palette, dark })
  const page = await context.newPage()
  page.setDefaultTimeout(15_000)
  page.setDefaultNavigationTimeout(30_000)
  monitorPage(page)
  await visit(page, '')
  const theme = await page.evaluate(() => ({
    palette: document.documentElement.dataset.theme,
    dark: document.documentElement.classList.contains('dark'),
  }))
  if (theme.palette !== palette || theme.dark !== dark)
    throw new Error(`Showcase capture did not apply the requested theme: ${JSON.stringify(theme)}`)
  await capture(page, `${palette}-hero`)
  if (palette === 'red') {
    await visit(page, '#project-1')
    await capture(page, 'work')
    await visit(page, '#gallery')
    await page.locator('[data-board]').scrollIntoViewIfNeeded()
    await page.waitForFunction(() => [
      ...document.querySelectorAll('[data-board-print]'),
    ].every((print) => {
      const style = getComputedStyle(print)
      return ['--entry-y', '--entry-rotate'].every(property => Math.abs(Number.parseFloat(style.getPropertyValue(property) || '0')) < 0.1)
    }))
    await capture(page, 'gallery')
    await page.keyboard.press(process.platform === 'darwin'
      ? 'Meta+k'
      : 'Control+k')
    await page.locator('#indexDialog').waitFor({ state: 'visible' })
    await page.locator('#indexDialog[data-menu-state="open"]').waitFor({ state: 'visible' })
    await page.waitForTimeout(500)
    await capture(page, 'index')
    await page.keyboard.press('Escape')
    await page.locator('#indexDialog').waitFor({ state: 'hidden' })
    await visit(page, '#contact')
    await page.locator('[data-poster-open]').click()
    await page.locator('[data-poster-canvas] svg').waitFor({ state: 'visible' })
    await capture(page, 'poster')
    await page.keyboard.press('Escape')
    await page.locator('#posterStudio').waitFor({ state: 'hidden' })
    await visit(page, '#skills')
    await page.locator('.chapter-transition--matrix').evaluate(transition => transition.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.waitForTimeout(900)
    await capture(page, 'chapter')
  }
  const loaded = await page.evaluate(() => [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family))
  if (![
    'Anton',
    'Instrument Serif',
    'Space Grotesk Variable',
    'JetBrains Mono Variable',
  ].every(family => loaded.some(value => value.includes(family)))) {
    throw new Error('Showcase capture did not load all four theme font families.')
  }
  await context.close()
}

async function captureLoader(browser) {
  progress('Visiting cold loader')
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2, colorScheme: 'light' })
  const page = await context.newPage()
  page.setDefaultTimeout(15_000)
  page.setDefaultNavigationTimeout(30_000)
  monitorPage(page)
  let releaseFont
  const pendingFont = new Promise((resolve) => {
    releaseFont = resolve
  })
  // Keep the real font-backed loader assembled while the screenshot is taken.
  // The delayed editorial font is not used by the loader's labels.
  await page.route(/instrument-serif.*\.woff2/, async (route) => {
    await pendingFont
    await route.continue()
  })
  try {
    await page.goto(base.href, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => document.documentElement.dataset.loaderState === 'assembling', undefined, { timeout: 5000 })
    await page.waitForFunction(() => document.fonts.check('400 30px "Anton"') && document.fonts.check('400 12px "JetBrains Mono Variable"'))
    await page.waitForTimeout(650)
    if (await page.locator('html').getAttribute('data-loader-state') !== 'assembling')
      throw new Error('The loader left its assembly phase before the showcase capture.')
    await capture(page, 'loader')
    releaseFont()
    await ready(page)
  }
  finally {
    releaseFont()
    await context.close()
  }
}

async function captureMobile(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light',
  })
  const page = await context.newPage()
  page.setDefaultTimeout(15_000)
  page.setDefaultNavigationTimeout(30_000)
  monitorPage(page)
  await visit(page, '')
  await capture(page, 'mobile')
  outputs.set('preview-mobile', captures.get('mobile'))
  await context.close()
}

function dualBoard() {
  return `<style>
    .dual{display:flex;flex-direction:column;width:2400px;height:1520px;padding:70px 64px;background:#f2eadb}
    .mast{display:flex;justify-content:space-between;align-items:end;border-bottom:2px solid #121110;padding-bottom:36px;margin-bottom:46px}
    .mast h1{font-family:Anton;font-size:86px;line-height:1;margin:0;letter-spacing:-1px}
    .mast p{font-family:'Instrument Serif';font-style:italic;font-size:52px;margin:0}
    .screens{display:grid;grid-template-columns:1fr 1fr;gap:32px}
    .screen header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;font-family:'JetBrains Mono';font-size:21px}
    .dot{display:inline-block;width:16px;height:16px;margin-right:14px}.red{background:#f03a17}.blue{background:#3157e7}
    .screen img{border:1px solid #777064;box-shadow:0 14px 24px #1211100c}
    .features{display:grid;grid-template-columns:repeat(4,1fr);gap:36px;margin-top:56px;padding-top:32px;border-top:2px solid #121110}
    .features b{font-family:Anton;font-size:36px;line-height:1.2;font-weight:400}.features p{font-size:25px;line-height:1.45;margin:14px 0 0;color:#575145;max-width:25ch}
    .foot{display:flex;justify-content:space-between;margin-top:auto;padding-top:48px;font-family:'JetBrains Mono';font-size:20px;letter-spacing:1px;color:#575145}
    </style><main class="dual"><header class="mast"><h1>ONE SYSTEM. TWO EXPRESSIONS.</h1><p>Constructa, in contrast.</p></header><div class="screens"><section class="screen"><header><span><i class="dot red"></i>SIGNAL / LIGHT</span><span>01</span></header><img src="${image(captures.get('red-hero'))}" alt="Signal light hero"></section><section class="screen"><header><span><i class="dot blue"></i>COBALT / DARK</span><span>02</span></header><img src="${image(captures.get('blue-hero'))}" alt="Cobalt dark hero"></section></div><div class="features"><div><b>One cv.json</b><p>Content, navigation, palette, copy and SEO.</p></div><div><b>A distinct identity</b><p>Interleaved letterforms and a shared geometric mark.</p></div><div><b>A complete experience</b><p>Layered loading, modular navigation and section-led work.</p></div><div><b>Made to keep</b><p>Project records, a contact sheet and print-ready exports.</p></div></div><footer class="foot"><span>REAL BROWSER CAPTURES / 2× PIXEL DENSITY</span><span>CONSTRUCTIVIST ASTRO THEME</span></footer></main>`
}

function featureBoard() {
  const items = [
    ['loader', '01 / COLOR ASSEMBLY', 'An entrance made from overlapping plates.'],
    ['work', '02 / SELECTED WORK', 'Section-driven motion, real case files.'],
    ['gallery', '03 / CONTACT SHEET', 'Arrange, browse, enlarge.'],
    ['index', '04 / EDITORIAL MENU', 'A generous curtain, a direct route to every chapter.'],
    ['poster', '05 / PRINT STUDIO', 'Compose and export a personal edition.'],
    ['chapter', '06 / CHAPTER CONTINUITY', 'One shared mark. A different shape for every chapter.'],
  ]
  return `<style>.board{display:flex;flex-direction:column;width:3840px;height:2880px;padding:72px 84px}.board-head{display:flex;justify-content:space-between;align-items:end;border-bottom:3px solid #121110;padding-bottom:40px;margin-bottom:44px}.board-head h1{font-family:Anton;font-size:115px;line-height:1;margin:0}.board-head p{font-family:'Instrument Serif';font-style:italic;font-size:67px;margin:0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:46px 40px}.panel figure{margin:0;background:#121110;border:1px solid #655e51}.panel img{aspect-ratio:1.6;object-fit:contain}.panel h2{font-family:'JetBrains Mono';font-size:25px;margin:25px 0 15px;font-weight:500;letter-spacing:2px}.panel p{font-size:31px;line-height:1.45;margin:0;color:#575145;max-width:34ch}.board-foot{margin-top:auto;padding-top:48px;border-top:3px solid #121110;display:grid;grid-template-columns:1.2fr 1fr;gap:80px}.board-foot b{font-family:Anton;font-weight:400;font-size:116px;line-height:1}.board-foot p{font-size:40px;line-height:1.4;margin:0;max-width:45ch}.board-foot .small{grid-column:1/-1;font-family:'JetBrains Mono';font-size:26px;display:flex;justify-content:space-between;padding-top:10px;color:#575145}</style><main class="board"><header class="board-head"><h1>MORE THAN A FIRST IMPRESSION.</h1><p>A system, fully expressed.</p></header><div class="grid">${items.map(([key, label, note]) => `<section class="panel"><figure><img src="${image(captures.get(key))}" alt="${label}"></figure><h2>${label}</h2><p>${note}</p></section>`).join('')}</div><footer class="board-foot"><b>ONE FILE.<br>ENTIRELY YOURS.</b><p>Six palettes. Light and dark. A complete document, with space for your work and character in every transition.</p><div class="small"><span>ACTUAL UI / ORIGINAL DEMO ART / SELF-HOSTED FONTS</span><span>CONSTRUCTA</span></div></footer></main>`
}

const browser = await chromium.launch()
try {
  const svg = coverSvg()
  const cover = await render(browser, 'project-cover', 3840, 2160, svg)
  const socialCard = await sharp(cover).resize(1200, 630, { fit: 'contain', background: '#f2eadb' }).png().toBuffer()
  if (!coverOnly) {
    await captureLoader(browser)
    await captureTheme(browser, 'red', false)
    await captureTheme(browser, 'blue', true)
    await captureMobile(browser)
    if (errors.length) {
      throw new Error(`Showcase browser errors: ${[
        ...new Set(errors),
      ].join('; ')}`)
    }
    await render(browser, 'preview-dual', 2400, 1520, dualBoard(), 1.6)
    await render(browser, 'preview-features', 3840, 2880, featureBoard())
  }
  // Keep the last complete set when a browser or rendering check fails.
  await mkdir(destination, { recursive: true })
  await writeFile(new URL('project-cover.svg', destination), svg)
  for (const [name, bytes] of outputs)
    await saveImage(name, bytes)
  for (const [name, source] of [
    ['submission-cover', 'project-cover'],
    ['submission-dual', 'preview-dual'],
    ['submission-features', 'preview-features'],
  ]) {
    const bytes = outputs.get(source)
    if (bytes) {
      await sharp(bytes).resize(1920, 1080, {
        fit: 'contain',
        background: '#f2eadb',
      }).png().toFile(fileURLToPath(new URL(`${name}.png`, destination)))
    }
  }
  await writeFile(new URL('social-card-v2.png', destination), socialCard)
  console.log(JSON.stringify({
    output: fileURLToPath(destination),
    base: base.href,
    coverOnly,
    captures: [
      ...captures.keys(),
    ],
    errors,
  }, null, 2))
}
finally {
  await browser.close()
}
