import { describe, expect, it } from 'vitest'
import { formatDate, formatPrice, withParams } from './utils'

describe('formatPrice', () => {
  it('formats cents as dollars and 0 as Free', () => {
    expect(formatPrice(2499)).toBe('$24.99')
    expect(formatPrice(0)).toBe('Free')
  })
})

it('formats release dates without time zone drift', () => {
  expect(formatDate('2026-01-01')).toBe('Jan 1, 2026')
})

describe('withParams', () => {
  it('merges changes, drops empty values and page 1', () => {
    expect(withParams('/search', { q: 'tide', page: 3 }, { page: 1, category: 'RPG' })).toBe(
      '/search?q=tide&category=RPG',
    )
    expect(withParams('/search', { q: undefined }, {})).toBe('/search')
  })
})
