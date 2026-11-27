import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(cents: number) {
  return cents === 0 ? 'Free' : usd.format(cents / 100)
}

export function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** Builds a URL that keeps the current filters and changes some of them. */
export function withParams(
  path: string,
  current: Record<string, string | number | undefined>,
  changes: Record<string, string | number | undefined>,
) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries({ ...current, ...changes })) {
    if (value !== undefined && value !== '' && !(key === 'page' && Number(value) === 1)) {
      params.set(key, String(value))
    }
  }
  const query = params.toString()
  return query ? `${path}?${query}` : path
}
