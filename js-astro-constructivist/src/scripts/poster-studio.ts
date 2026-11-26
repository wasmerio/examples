// @env browser
import { uiText } from './ui'

interface PosterFact {
  label: string
  value: string
}

interface PosterData {
  name: string
  nameLines: string[]
  label: string
  summary: string
  email: string
  url: string
  location: string
  facts: PosterFact[]
  projects: string[]
  year: number
}

interface PosterTones {
  paper: string
  ink: string
  muted: string
  accent: string
  onAccent: string
  accentText: string
}

interface FontSource {
  family: string
  rule: CSSFontFaceRule
  base: string
}

const WIDTH = 1200
const HEIGHT = 1600
const MARGIN = 64
const CONTENT_WIDTH = WIDTH - MARGIN * 2
const RIGHT_EDGE = WIDTH - MARGIN

const DISPLAY_STACK = '"Anton", Impact, "Arial Narrow", Haettenschweiler, sans-serif'
const MONO_STACK
  = '"JetBrains Mono Variable", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'
const SANS_STACK = '"Space Grotesk Variable", "Helvetica Neue", Arial, sans-serif'

const FONT_FAMILIES = ['anton', 'space grotesk variable', 'jetbrains mono variable']
const FONT_MARKER = '/*PS_FONTS*/'
const POSTER_STYLE = [
  `.ps-poster .ps-display{font-family:${DISPLAY_STACK}}`,
  `.ps-poster .ps-mono{font-family:${MONO_STACK}}`,
  `.ps-poster .ps-sans{font-family:${SANS_STACK}}`,
  '.ps-poster text{font-kerning:normal}',
].join('')

let initialized = false
let measureContext: CanvasRenderingContext2D | null = null
let fontCssPromise: Promise<string> | null = null
let cachedFontCss = ''

function measureWidth(text: string, size: number, family: string, weight = 400): number {
  if (!measureContext)
    measureContext = document.createElement('canvas').getContext('2d')
  if (!measureContext)
    return text.length * size * 0.56
  measureContext.font = `${weight} ${size}px ${family}`
  return measureContext.measureText(text).width
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Deterministic seed generator: every reprint redraws the same recipe. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6D2B79F5) >>> 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function splitName(name: string): string[] {
  const spaced = name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
  const words = spaced.split(' ').filter(Boolean)
  if (words.length === 0) {
    return [
      uiText('poster.portfolio').toUpperCase(),
    ]
  }
  const lines = words.length > 2
    ? [
        words.slice(0, -1).join(' '),
        words[words.length - 1],
      ]
    : words
  return lines.map(line => line.toUpperCase())
}

function fitFontSize(lines: string[], maxWidth: number, maxSize: number): number {
  let size = maxSize
  for (const line of lines) {
    const width = measureWidth(line, 100, DISPLAY_STACK)
    if (width > 0)
      size = Math.min(size, (maxWidth / width) * 100)
  }
  return Math.max(28, Math.floor(size))
}

function ellipsize(
  line: string,
  maxWidth: number,
  size: number,
  family: string,
  weight: number,
): string {
  let text = line
  while (text.length > 1 && measureWidth(`${text}…`, size, family, weight) > maxWidth)
    text = text.slice(0, -1).trimEnd()
  return `${text}…`
}

function wrapText(
  text: string,
  maxWidth: number,
  size: number,
  family: string,
  weight: number,
  maxLines: number,
): string[] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
  if (words.length === 0)
    return []

  const lines: string[] = []
  let current = ''
  let index = 0

  while (index < words.length) {
    const word = words[index]
    const candidate = current
      ? `${current} ${word}`
      : word
    if (!current || measureWidth(candidate, size, family, weight) <= maxWidth) {
      current = candidate
      index += 1
      continue
    }
    if (lines.length === maxLines - 1) {
      lines.push(ellipsize(current, maxWidth, size, family, weight))
      return lines
    }
    lines.push(current)
    current = ''
  }

  if (current)
    lines.push(current)
  return lines.slice(0, maxLines)
}

function readTones(): PosterTones {
  const computed = getComputedStyle(document.documentElement)
  const read = (token: string, fallback: string) =>
    computed.getPropertyValue(token).trim() || fallback
  return {
    paper: read('--bg', '#f2eadb'),
    ink: read('--fg', '#121110'),
    muted: read('--fg-2', '#575145'),
    accent: read('--accent', '#f03a17'),
    onAccent: read('--on-accent', '#121110'),
    accentText: read('--accent-text', '#a82a12'),
  }
}

function stamp(
  text: string,
  centerX: number,
  centerY: number,
  angle: number,
  tones: PosterTones,
): string {
  const width = measureWidth(text, 20, MONO_STACK, 600) + text.length * 2 + 36
  const height = 48
  return [
    `<g transform="rotate(${round(angle)} ${round(centerX)} ${round(centerY)})">`,
    `<rect x="${round(centerX - width / 2)}" y="${round(centerY - height / 2)}" width="${round(width)}" height="${height}" fill="${tones.paper}" stroke="${tones.ink}" stroke-width="2"/>`,
    `<text x="${round(centerX)}" y="${round(centerY + 7)}" class="ps-mono" font-size="20" font-weight="600" letter-spacing="2" text-anchor="middle" fill="${tones.ink}">${escapeXml(text)}</text>`,
    '</g>',
  ].join('')
}

function buildPoster(
  data: PosterData,
  seed: number,
  tones: PosterTones,
  fontCss: string,
): string {
  const random = mulberry32(seed)
  const seedLabel = String(seed % 1000).padStart(3, '0')
  const title = `${data.name} · ${data.label}`

  // Seeded geometry: beam sweep, circle, wedge, grid, halftone, stamp angles.
  const beamAngle = -30 + random() * 20
  const beamTop = 260 + random() * 240
  const beamThickness = 80 + random() * 120
  const dotStep = 27 + Math.round(random() * 7)
  const wedgeInset = 24 + random() * 86
  const gridStep = 26 + Math.round(random() * 8)
  const gridOpacity = 0.12 + random() * 0.08
  const circleRadius = 158 + random() * 52
  const circleX = 952 + random() * 88
  const circleY = 318 + random() * 78
  const stampOne = -9 + random() * 5
  const stampTwo = 3 + random() * 5

  const nameLines = data.nameLines.length
    ? data.nameLines.map(line => line.toUpperCase())
    : splitName(data.name)
  const nameSize = Math.min(
    fitFontSize(nameLines, 980, 300),
    Math.floor(460 / (nameLines.length * 0.9)),
  )
  const nameTop = 148
  const nameBaseline = nameTop + nameSize * 0.82
  const namePitch = nameSize * 0.9
  const nameBottom = nameBaseline + (nameLines.length - 1) * namePitch + nameSize * 0.02

  const labelText = (data.label || uiText('poster.portfolio')).toUpperCase()
  const bandWidth = Math.min(
    680,
    Math.max(300, measureWidth(labelText, 26, MONO_STACK, 600) + labelText.length * 3 + 64),
  )
  const bandY = Math.max(600, round(nameBottom + 46))
  const bandHeight = 72

  const facts = data.facts
  const factGap = 24
  const factColumns = Math.max(1, facts.length)
  const factWidth = (CONTENT_WIDTH - factGap * (factColumns - 1)) / factColumns
  const factsTop = bandY + 138
  const factValues = facts.map(fact =>
    wrapText(fact.value, factWidth, 21, MONO_STACK, 400, 3))

  const summaryLines = wrapText(data.summary, 1040, 30, SANS_STACK, 400, 4)
  const summaryTop = factsTop + 152

  const projects = data.projects
  const projectsTop = 1150
  const projectNameX = MARGIN + 86
  const footerRule = 1466
  const projectPitch = Math.min(58, (footerRule - projectsTop - 80) / Math.max(1, projects.length - 1))

  const beam = `<rect x="-360" y="${round(beamTop)}" width="1900" height="${round(beamThickness)}" fill="${tones.ink}" transform="rotate(${round(beamAngle)} 600 800)" opacity="0.055"/>`

  const dots: string[] = []
  for (let row = 0; row < 19; row += 1) {
    for (let column = 0; column < 7; column += 1) {
      const falloff = 1 - (row / 19) * 0.85 - (column / 7) * 0.15
      const radius = 0.8 + Math.max(0.2, falloff) * (3.2 + random() * 1.4)
      const cx = 1006 + column * dotStep
      const cy = 58 + row * dotStep
      dots.push(`<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(radius)}"/>`)
    }
  }
  const halftone = `<g fill="${tones.accent}" opacity="0.42">${dots.join('')}</g>`

  const wedge = `<polygon points="${WIDTH},${round(1180 + wedgeInset)} ${WIDTH},1470 ${round(950 + wedgeInset)},1470" fill="${tones.accent}" opacity="0.92"/>`

  const gridLines: string[] = []
  for (let x = 940; x <= WIDTH; x += gridStep)
    gridLines.push(`<line x1="${x}" y1="1130" x2="${x}" y2="1470"/>`)
  for (let y = 1130; y <= 1470; y += gridStep)
    gridLines.push(`<line x1="940" y1="${y}" x2="${WIDTH}" y2="${y}"/>`)
  const grid = `<g stroke="${tones.ink}" stroke-width="1.2" opacity="${round(gridOpacity)}">${gridLines.join('')}</g>`

  const circle = `<circle cx="${round(circleX)}" cy="${round(circleY)}" r="${round(circleRadius)}" fill="${tones.accent}" opacity="0.94"/>`

  const metaRight = [
    data.location.toUpperCase(),
    String(data.year),
  ]
    .filter(Boolean)
    .join(' · ')

  const header = [
    `<rect x="${MARGIN}" y="54" width="36" height="36" fill="${tones.accent}"/>`,
    `<text x="${MARGIN + 52}" y="82" class="ps-mono" font-size="19" letter-spacing="2.4" fill="${tones.muted}">${escapeXml(uiText('poster.sheetTitle').toUpperCase())}</text>`,
    `<text x="${RIGHT_EDGE}" y="82" class="ps-mono" font-size="19" letter-spacing="2.4" text-anchor="end" fill="${tones.muted}">${escapeXml(metaRight)}</text>`,
    `<line x1="${MARGIN}" y1="112" x2="${RIGHT_EDGE}" y2="112" stroke="${tones.ink}" stroke-width="2"/>`,
  ].join('')

  const nameMarkup = nameLines
    .map((line, index) => {
      const y = nameBaseline + index * namePitch
      return `<text x="${MARGIN}" y="${round(y)}" class="ps-display" font-size="${nameSize}" fill="${tones.ink}" stroke="${tones.paper}" stroke-width="10" stroke-linejoin="round" paint-order="stroke">${escapeXml(line)}</text>`
    })
    .join('')

  const band = [
    `<rect x="${MARGIN}" y="${round(bandY)}" width="${round(bandWidth)}" height="${bandHeight}" fill="${tones.accent}"/>`,
    `<text x="${MARGIN + 28}" y="${round(bandY + 47)}" class="ps-mono" font-size="26" font-weight="600" letter-spacing="3" fill="${tones.onAccent}">${escapeXml(labelText)}</text>`,
    `<text x="${RIGHT_EDGE}" y="${round(bandY + 47)}" class="ps-mono" font-size="20" letter-spacing="2" text-anchor="end" fill="${tones.muted}">${escapeXml(uiText('poster.print').toUpperCase())} ${seedLabel} / ${data.year}</text>`,
  ].join('')

  const factsMarkup = [
    `<line x1="${MARGIN}" y1="${round(factsTop - 32)}" x2="${RIGHT_EDGE}" y2="${round(factsTop - 32)}" stroke="${tones.ink}" stroke-width="1.5" opacity="0.3"/>`,
    ...facts.map((fact, index) => {
      const x = round(MARGIN + index * (factWidth + factGap))
      const labels = wrapText(fact.label.toUpperCase(), factWidth - 12, 14, MONO_STACK, 600, 2)
        .map((line, lineIndex) => `<text x="${x}" y="${factsTop + lineIndex * 22}" class="ps-mono" font-size="14" font-weight="600" letter-spacing="1" fill="${tones.accentText}">${escapeXml(line)}</text>`)
        .join('')
      const values = factValues[index]
        .map((line, lineIndex) =>
          `<text x="${x}" y="${round(factsTop + 56 + lineIndex * 28)}" class="ps-mono" font-size="21" fill="${tones.ink}">${escapeXml(line)}</text>`)
        .join('')
      return labels + values
    }),
  ].join('')

  const summaryMarkup = [
    `<rect x="${MARGIN}" y="${round(summaryTop - 30)}" width="64" height="8" fill="${tones.accent}"/>`,
    ...summaryLines.map((line, index) =>
      `<text x="${MARGIN}" y="${round(summaryTop + 30 + index * 42)}" class="ps-sans" font-size="30" fill="${tones.ink}">${escapeXml(line)}</text>`),
  ].join('')

  const projectsMarkup = [
    `<text x="${MARGIN}" y="${projectsTop - 22}" class="ps-mono" font-size="18" font-weight="600" letter-spacing="2.6" fill="${tones.accentText}">${escapeXml(uiText('projects.selected').toUpperCase())} / ${String(projects.length).padStart(2, '0')}</text>`,
    ...projects.map((project, index) => {
      const baseline = projectsTop + 46 + index * projectPitch
      const name = project.toUpperCase()
      const size = fitFontSize([name], 960, Math.min(40, projectPitch * 0.7))
      return [
        `<line x1="${MARGIN}" y1="${baseline - 34}" x2="${RIGHT_EDGE}" y2="${baseline - 34}" stroke="${tones.ink}" stroke-width="1" opacity="0.28"/>`,
        `<rect x="${MARGIN}" y="${baseline - 14}" width="12" height="12" fill="${tones.accent}"/>`,
        `<text x="${MARGIN + 26}" y="${baseline}" class="ps-mono" font-size="20" font-weight="600" fill="${tones.accentText}">${String(index + 1).padStart(2, '0')}</text>`,
        `<text x="${projectNameX}" y="${baseline}" class="ps-display" font-size="${size}" fill="${tones.ink}">${escapeXml(name)}</text>`,
      ].join('')
    }),
    projects.length > 0
      ? `<line x1="${MARGIN}" y1="${projectsTop + 46 + (projects.length - 1) * projectPitch + 24}" x2="${RIGHT_EDGE}" y2="${projectsTop + 46 + (projects.length - 1) * projectPitch + 24}" stroke="${tones.ink}" stroke-width="1.5" opacity="0.4"/>`
      : '',
  ].join('')

  const footer = [
    `<line x1="${MARGIN}" y1="${footerRule}" x2="${RIGHT_EDGE}" y2="${footerRule}" stroke="${tones.ink}" stroke-width="2"/>`,
    `<text x="${MARGIN}" y="1508" class="ps-mono" font-size="26" font-weight="500" fill="${tones.ink}">${escapeXml(data.email)}</text>`,
    `<text x="${MARGIN}" y="1540" class="ps-mono" font-size="22" fill="${tones.muted}">${escapeXml(data.url)}</text>`,
  ].join('')

  const stamps = [
    stamp(`${uiText('poster.seed').toUpperCase()} ${seedLabel}`, 1060, 146, stampOne, tones),
    stamp(uiText('poster.edition').toUpperCase(), 1024, 1508, stampTwo, tones),
  ].join('')

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" class="ps-poster" role="img" aria-labelledby="psTitle${seedLabel}">`,
    `<title id="psTitle${seedLabel}">${escapeXml(uiText('poster.alt').replace('{name}', title).replace('{seed}', seedLabel))}</title>`,
    `<desc>${escapeXml(uiText('poster.description').replace('{label}', data.label).replace('{email}', data.email))}</desc>`,
    `<defs><style>${POSTER_STYLE}${fontCss}</style></defs>`,
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${tones.paper}"/>`,
    beam,
    halftone,
    wedge,
    grid,
    circle,
    header,
    nameMarkup,
    band,
    factsMarkup,
    summaryMarkup,
    projectsMarkup,
    footer,
    stamps,
    `<rect x="0" y="1584" width="${WIDTH}" height="16" fill="${tones.accent}"/>`,
    '</svg>',
  ].join('')
}

function rangeCovers(range: string, codePoint: number): boolean {
  for (const part of range.split(',')) {
    const bounds = part.trim().replace(/^u\+/i, '').split('-')
    const start = Number.parseInt(bounds[0] ?? '', 16)
    const end = bounds[1]
      ? Number.parseInt(bounds[1], 16)
      : start
    if (Number.isFinite(start) && codePoint >= start && codePoint <= end)
      return true
  }
  return false
}

/** Some engines expose font descriptors through cssText only. */
function fontDescriptor(rule: CSSFontFaceRule, name: string): string {
  const match = new RegExp(`(?:^|[;{])\\s*${name}\\s*:\\s*([^;}]+)`, 'i').exec(rule.cssText)
  const value = match?.[1] ?? rule.style.getPropertyValue(name)
  return value.replace(/['"]/g, '').trim()
}

function usableFontFace(
  rule: CSSFontFaceRule,
  base: string,
  out: FontSource[],
): FontSource | null {
  const family = fontDescriptor(rule, 'font-family').toLowerCase()
  if (!FONT_FAMILIES.includes(family))
    return null
  const range = fontDescriptor(rule, 'unicode-range')
  if (range && !rangeCovers(range, 0x41))
    return null
  if (out.some(source => source.family === family))
    return null
  return { family, rule, base }
}

function collectFromRules(rules: CSSRuleList, base: string, out: FontSource[]): void {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSFontFaceRule) {
      const source = usableFontFace(rule, base, out)
      if (source)
        out.push(source)
      continue
    }
    if ('cssRules' in rule) {
      try {
        collectFromRules((rule as CSSGroupingRule).cssRules, base, out)
      }
      catch {
        // A grouping rule that refuses access cannot hide a usable face.
      }
    }
  }
}

function collectFontSources(): FontSource[] {
  const sources: FontSource[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      collectFromRules(sheet.cssRules, sheet.href ?? document.baseURI, sources)
    }
    catch {
      // Cross-origin sheets are unreadable; the fallback stack covers them.
    }
  }
  return sources
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunk = 0x8000
  for (let index = 0; index < bytes.length; index += chunk)
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk))
  return btoa(binary)
}

async function loadFontFace(source: FontSource): Promise<string> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 6000)
  try {
    const src = source.rule.style.getPropertyValue('src')
    const match = /url\(\s*(?:'([^']+)'|"([^"]+)"|([^'")\s]+))\s*\)/.exec(src)
    const rawUrl = match?.[1] ?? match?.[2] ?? match?.[3]
    if (!rawUrl)
      return ''
    const url = new URL(rawUrl, source.base).href
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok)
      return ''
    const bytes = new Uint8Array(await response.arrayBuffer())
    const family = source.rule.style.getPropertyValue('font-family').replace(/['"]/g, '').trim()
    const weight = source.rule.style.getPropertyValue('font-weight').trim() || '400'
    const style = source.rule.style.getPropertyValue('font-style').trim() || 'normal'
    return `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};font-display:block;src:url("data:font/woff2;base64,${toBase64(bytes)}") format("woff2")}`
  }
  catch {
    return ''
  }
  finally {
    window.clearTimeout(timer)
  }
}

async function loadFontCss(): Promise<string> {
  if (cachedFontCss)
    return cachedFontCss
  if (!fontCssPromise) {
    fontCssPromise = Promise.all(collectFontSources().map(loadFontFace))
      .then(blocks => blocks.filter(Boolean).join('\n'))
      .catch(() => '')
  }
  cachedFontCss = await fontCssPromise
  return cachedFontCss
}

function readData(root: HTMLElement): PosterData | null {
  const raw = root.dataset.posterData
  if (!raw)
    return null
  try {
    const parsed = JSON.parse(raw) as Partial<PosterData>
    if (!parsed.name)
      return null
    return {
      name: parsed.name,
      nameLines: Array.isArray(parsed.nameLines)
        ? parsed.nameLines
        : [],
      label: parsed.label ?? '',
      summary: parsed.summary ?? '',
      email: parsed.email ?? '',
      url: parsed.url ?? '',
      location: parsed.location ?? '',
      facts: Array.isArray(parsed.facts)
        ? parsed.facts
        : [],
      projects: Array.isArray(parsed.projects)
        ? parsed.projects
        : [],
      year: typeof parsed.year === 'number'
        ? parsed.year
        : new Date().getFullYear(),
    }
  }
  catch {
    return null
  }
}

async function ensureFonts(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('400 100px "Anton"'),
      document.fonts.load('400 30px "Space Grotesk Variable"'),
      document.fonts.load('500 20px "JetBrains Mono Variable"'),
    ])
    await document.fonts.ready
  }
  catch {
    // Fallback stacks still measure and render a legible poster.
  }
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  const host = document.querySelector('dialog[open]') ?? document.body
  host.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}

async function renderPng(markup: string): Promise<Blob> {
  const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }))
  try {
    const image = new Image()
    const loaded = Promise.withResolvers<void>()
    image.onload = () => loaded.resolve()
    image.onerror = () => loaded.reject(new Error('Poster image failed to load'))
    image.src = svgUrl
    await loaded.promise

    const canvas = document.createElement('canvas')
    canvas.width = WIDTH
    canvas.height = HEIGHT
    const context = canvas.getContext('2d')
    if (!context)
      throw new Error('Canvas is unavailable')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const encoded = Promise.withResolvers<Blob>()
    canvas.toBlob(
      blob => (blob
        ? encoded.resolve(blob)
        : encoded.reject(new Error('PNG encoding failed'))),
      'image/png',
    )
    return await encoded.promise
  }
  finally {
    URL.revokeObjectURL(svgUrl)
  }
}

export function initPosterStudio(): void {
  if (initialized)
    return

  const dialog = document.getElementById('posterStudio') as HTMLDialogElement | null
  if (!dialog)
    return
  const data = readData(dialog)
  if (!data)
    return

  const canvasHost = dialog.querySelector<HTMLElement>('[data-poster-canvas]')
  if (!canvasHost)
    return
  initialized = true

  const status = dialog.querySelector<HTMLElement>('[data-poster-status]')
  const reprintButton = dialog.querySelector<HTMLButtonElement>('[data-poster-reprint]')
  const svgButton = dialog.querySelector<HTMLButtonElement>('[data-poster-svg]')
  const pngButton = dialog.querySelector<HTMLButtonElement>('[data-poster-png]')

  let seed = Math.floor(Math.random() * 1000)
  let currentMarkup = ''
  let lastTrigger: HTMLElement | null = null
  let exporting = false

  const seedLabel = (value: number) => String(value % 1000).padStart(3, '0')
  const nameSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'poster'
  const announce = (message: string): void => {
    if (status)
      status.textContent = message
  }

  const renderPoster = (): void => {
    currentMarkup = buildPoster(data, seed, readTones(), FONT_MARKER)
    canvasHost.innerHTML = currentMarkup
  }

  const exportMarkup = async (): Promise<string> => {
    if (!currentMarkup)
      renderPoster()
    const fontCss = await loadFontCss()
    return fontCss
      ? currentMarkup.replace(FONT_MARKER, () => fontCss)
      : currentMarkup
  }

  const open = (trigger: HTMLElement): void => {
    if (dialog.open)
      return
    lastTrigger = trigger
    dialog.showModal()
    reprintButton?.focus({ preventScroll: true })
    announce('')
    renderPoster()
    void loadFontCss()
    void (async () => {
      await ensureFonts()
      if (dialog.open)
        renderPoster()
    })()
  }

  const close = (): void => {
    if (dialog.open)
      dialog.close()
  }

  const reprint = (): void => {
    let next = seed
    while (next === seed)
      next = Math.floor(Math.random() * 1000)
    seed = next
    renderPoster()
    announce(uiText('poster.reprinted').replace('{seed}', seedLabel(seed)))
  }

  const downloadSvg = async (): Promise<void> => {
    if (exporting)
      return
    exporting = true
    if (svgButton)
      svgButton.disabled = true
    announce(uiText('poster.svgPending'))
    const fileSeed = seedLabel(seed)
    try {
      const markup = await exportMarkup()
      saveBlob(
        new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }),
        `${nameSlug}-poster-${fileSeed}.svg`,
      )
      announce(uiText('poster.svgReady').replace('{seed}', fileSeed))
    }
    catch {
      announce(uiText('poster.svgFailed'))
    }
    finally {
      exporting = false
      if (svgButton)
        svgButton.disabled = false
    }
  }

  const downloadPng = async (): Promise<void> => {
    if (exporting)
      return
    exporting = true
    if (pngButton)
      pngButton.disabled = true
    announce(uiText('poster.pngPending'))
    const fileSeed = seedLabel(seed)
    try {
      const markup = await exportMarkup()
      const blob = await renderPng(markup)
      saveBlob(blob, `${nameSlug}-poster-${fileSeed}.png`)
      announce(uiText('poster.pngReady').replace('{seed}', fileSeed))
    }
    catch {
      announce(uiText('poster.pngFailed'))
    }
    finally {
      exporting = false
      if (pngButton)
        pngButton.disabled = false
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element))
      return
    const trigger = target.closest<HTMLElement>('[data-poster-open]')
    if (!trigger)
      return
    event.preventDefault()
    open(trigger)
  })

  reprintButton?.addEventListener('click', reprint)
  svgButton?.addEventListener('click', () => void downloadSvg())
  pngButton?.addEventListener('click', () => void downloadPng())

  for (const closer of dialog.querySelectorAll<HTMLElement>('[data-poster-close]'))
    closer.addEventListener('click', close)

  dialog.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element))
      return
    if (target === dialog) {
      close()
      return
    }
    if (!target.closest('.poster-studio__frame'))
      return
    if (target.closest('.poster-studio__bar, .poster-studio__figure, .poster-studio__controls'))
      return
    close()
  })

  dialog.addEventListener('close', () => {
    if (lastTrigger?.isConnected)
      lastTrigger.focus({ preventScroll: true })
  })
}
