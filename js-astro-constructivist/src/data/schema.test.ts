import { describe, expect, it } from 'vitest'
import rawCv from '../../cv.json'
import { cvSchema, workSchema } from './schema'

describe('cvSchema', () => {
  it('accepts the cv.json shipped with the repository', () => {
    const result = cvSchema.safeParse(rawCv)

    expect(result.error?.issues).toBeUndefined()
    expect(result.success).toBe(true)
  })

  it('applies defaults for optional collections', () => {
    const parsed = cvSchema.parse({
      basics: { name: 'Tester', label: 'Dev' },
    })

    expect(parsed.work).toEqual([])
    expect(parsed.basics.theme).toBe('red')
  })

  it('treats an empty link as missing', () => {
    const parsed = cvSchema.parse({
      basics: { name: 'Tester', label: 'Dev', url: '' },
    })

    expect(parsed.basics.url).toBeUndefined()
  })

  it('rejects malformed dates', () => {
    const result = workSchema.safeParse({
      name: 'Acme',
      position: 'Dev',
      startDate: '2022/06/01',
    })

    expect(result.success).toBe(false)
  })

  it('rejects removed layout options instead of silently ignoring them', () => {
    const result = cvSchema.safeParse({
      basics: { name: 'Tester', label: 'Dev' },
      pageLayout: 'two',
    })

    expect(result.success).toBe(false)
  })
})
