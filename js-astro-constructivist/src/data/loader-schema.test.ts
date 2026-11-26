import { describe, expect, it } from 'vitest'
import { siteSchema } from './config-schema'

describe('loader configuration', () => {
  it('provides a short finite default sequence and configurable color plates', () => {
    const { loader } = siteSchema.parse({})
    expect(loader.enabled).toBe(true)
    expect(loader.minimumDuration).toBe(1800)
    expect(loader.maxWait).toBe(6000)
    expect(loader.colors).toHaveLength(5)
  })

  it('supports disabling the loader without requiring timing or color fields', () => {
    expect(siteSchema.parse({
      loader: { enabled: false },
    }).loader.enabled).toBe(false)
  })

  it.each([
    { minimumDuration: -1 },
    { minimumDuration: Number.POSITIVE_INFINITY },
    { maxWait: 20000 },
    {
      colors: ['red', '#000', '#fff'],
    },
    {
      colors: ['#000', '#fff'],
    },
    { label: '' },
  ])('rejects unsafe or unbounded animation settings %#', (loader) => {
    expect(siteSchema.safeParse({ loader }).success).toBe(false)
  })
})
