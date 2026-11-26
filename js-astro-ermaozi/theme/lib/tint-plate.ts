export type TintColor = { value: number, offset: number }
export type TintPlate = { r: TintColor, g: TintColor, b: TintColor }

const light: TintPlate = { r: { value: 200, offset: 36 }, g: { value: 200, offset: 36 }, b: { value: 200, offset: 36 } }
const dark: TintPlate = { r: { value: 32, offset: 36 }, g: { value: 32, offset: 36 }, b: { value: 32, offset: 36 } }
const color = (value: number): TintColor => ({ value, offset: Math.min(64, 256 - value) })
const parse = (value: number | string): TintPlate | undefined => {
  const values = typeof value === 'number' || Number(value) === Number.parseInt(value)
    ? [value, value, value].map(Number)
    : String(value).includes(',') ? String(value).replace(/\s/g, '').split(',').map(Number) : []
  return values.length === 3 ? { r: color(values[0]), g: color(values[1]), b: color(values[2]) } : undefined
}

export function tintPlateColors(config: unknown, isDark: boolean): TintPlate {
  const fallback = isDark ? dark : light
  if (!config) return fallback
  if (typeof config === 'number' || typeof config === 'string') return isDark ? fallback : parse(config) ?? fallback
  if (typeof config !== 'object') return fallback

  const value = config as Record<string, any>
  if ('rgb' in value) return value.rgb ? (isDark ? fallback : parse(value.rgb) ?? fallback) : fallback
  if ('light' in value || 'dark' in value) {
    if (!value.light && !value.dark) return fallback
    const themed = value[isDark ? 'dark' : 'light']
    if (typeof themed === 'number' || typeof themed === 'string') return parse(themed) ?? fallback
    return fallback
  }
  if (isDark || !('r' in value)) return fallback
  return Object.fromEntries((['r', 'g', 'b'] as const).map(key => {
    const channel = value[key] ?? fallback[key]
    return [key, { value: Number(channel.value), offset: Number(channel.offset) }]
  })) as TintPlate
}
