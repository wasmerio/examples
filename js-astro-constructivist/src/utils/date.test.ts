import { describe, expect, it } from 'vitest'
import { formatDateRange, formatPeriod, getYear } from './date'

describe('getYear', () => {
  it('extracts the year from a full date', () => {
    expect(getYear('2022-06-01')).toBe('2022')
  })

  it('extracts the year from a month-only date', () => {
    expect(getYear('2023-01')).toBe('2023')
  })

  it('returns null for missing or malformed values', () => {
    expect(getYear(null)).toBeNull()
    expect(getYear(undefined)).toBeNull()
    expect(getYear('')).toBeNull()
    expect(getYear('not-a-date')).toBeNull()
  })
})

describe('formatDateRange', () => {
  it('joins both years', () => {
    expect(formatDateRange('2021-09-01', '2025-06-17')).toBe('2021 - 2025')
  })

  it('falls back to the ongoing label when the end date is missing', () => {
    expect(formatDateRange('2022-06-01', null)).toBe('2022 - Present')
    expect(formatDateRange('2022-06-01')).toBe('2022 - Present')
    expect(formatDateRange('2022-06-01', undefined, 'Now')).toBe('2022 - Now')
  })
})

describe('formatPeriod', () => {
  it('formats a closed period', () => {
    expect(formatPeriod('2022-06-01', '2024-02-11')).toBe('2022.06 → 2024.02')
  })

  it('marks an open period as ongoing', () => {
    expect(formatPeriod('2022-06-01', null)).toBe('2022.06 → NOW')
    expect(formatPeriod('2022-06-01', undefined, 'Present')).toBe('2022.06 → Present')
  })
})
