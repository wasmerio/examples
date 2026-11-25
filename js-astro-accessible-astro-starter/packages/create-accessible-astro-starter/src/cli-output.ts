const RESET = '\u001B[0m'
const GRAY = '\u001B[90m'

const INTRO_TITLE = 'Accessible Astro'

const INTRO_BANNER_LINES = [
  '░█▀█░█▀▀░█▀▀░█▀▀░█▀▀░█▀▀░▀█▀░█▀▄░█░░░█▀▀░░░█▀█░█▀▀░▀█▀░█▀▄░█▀█',
  '░█▀█░█░░░█░░░█▀▀░▀▀█░▀▀█░░█░░█▀▄░█░░░█▀▀░░░█▀█░▀▀█░░█░░█▀▄░█░█',
  '░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀▀▀░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀▀▀░░░▀░▀░▀▀▀░░▀░░▀░▀░▀▀▀',
]

const MIN_BANNER_COLUMNS = Math.max(...INTRO_BANNER_LINES.map((line) => line.length)) + 4

const INTRO_GRADIENT = [
  { r: 163, g: 230, b: 53 },
  { r: 45, g: 212, b: 191 },
  { r: 168, g: 85, b: 247 },
]

export const outroMessage = 'Go make the internet a more accessible place! ✨'

type RenderOptions = {
  color?: boolean
  columns?: number
}

type Rgb = {
  r: number
  g: number
  b: number
}

function shouldUseColor(): boolean {
  if (process.env.FORCE_COLOR === '0') {
    return false
  }

  if (process.env.FORCE_COLOR !== undefined) {
    return true
  }

  return !process.env.NO_COLOR && Boolean(process.stdout.isTTY)
}

function colorize(value: string, open: string, color: boolean): string {
  return color ? `${open}${value}${RESET}` : value
}

function gray(value: string, color: boolean): string {
  return colorize(value, GRAY, color)
}

function interpolateColor(stops: Rgb[], progress: number): Rgb {
  if (stops.length === 1) {
    return stops[0]
  }

  const clampedProgress = Math.min(Math.max(progress, 0), 1)
  const scaledProgress = clampedProgress * (stops.length - 1)
  const startIndex = Math.min(Math.floor(scaledProgress), stops.length - 2)
  const endIndex = startIndex + 1
  const segmentProgress = scaledProgress - startIndex
  const start = stops[startIndex]
  const end = stops[endIndex]

  return {
    r: Math.round(start.r + (end.r - start.r) * segmentProgress),
    g: Math.round(start.g + (end.g - start.g) * segmentProgress),
    b: Math.round(start.b + (end.b - start.b) * segmentProgress),
  }
}

function rgb(value: string, { r, g, b }: Rgb, color: boolean): string {
  return colorize(value, `\u001B[38;2;${r};${g};${b}m`, color)
}

function gradient(value: string, stops: Rgb[], color: boolean): string {
  if (!color || value.length === 0) {
    return value
  }

  return Array.from(value)
    .map((character, index, characters) =>
      rgb(character, interpolateColor(stops, index / Math.max(characters.length - 1, 1)), true),
    )
    .join('')
}

export function renderIntro(options: RenderOptions = {}): string {
  const color = options.color ?? shouldUseColor()

  if (options.columns !== undefined && options.columns < MIN_BANNER_COLUMNS) {
    return `${gray('┌', color)}  ${INTRO_TITLE}\n`
  }

  const banner = INTRO_BANNER_LINES.map((line) => `${gray('│', color)}  ${gradient(line, INTRO_GRADIENT, color)}`)

  return `${gray('┌', color)}\n${banner.join('\n')}\n`
}
