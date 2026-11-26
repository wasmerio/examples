import { describe, expect, it } from 'vitest'
import { stripLeadingEmoji } from './text'

describe('stripLeadingEmoji', () => {
  it('removes a leading pictograph and its trailing space', () => {
    expect(stripLeadingEmoji('🏆 Won an award')).toBe('Won an award')
  })

  it('removes compound emoji with variation selectors and joiners', () => {
    expect(stripLeadingEmoji('😮‍💨 Shipped it')).toBe('Shipped it')
  })

  it('keeps plain text untouched', () => {
    expect(stripLeadingEmoji('No emoji here')).toBe('No emoji here')
  })
})
