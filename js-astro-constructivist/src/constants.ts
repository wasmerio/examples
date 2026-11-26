export const THEMES = [
  'red',
  'pink',
  'orange',
  'cyber',
  'green',
  'blue',
] as const

export type ThemeName = (typeof THEMES)[number]

export const DARK_STORAGE_KEY = 'theme'

export const PALETTE_STORAGE_KEY = 'data-theme'
