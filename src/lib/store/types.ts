import { z } from 'zod'
import { CATEGORIES, PLATFORMS } from '@/data/catalog'

export interface GameSummary {
  slug: string
  title: string
  developer: string
  priceCents: number
  releasedAt: string
}

export interface GameDetails extends GameSummary {
  description: string
  categories: string[]
  platforms: string[]
  screenshots: number
}

export interface Page<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  hasNextPage: boolean
}

export const SORTS = ['newest', 'price-asc', 'price-desc', 'title'] as const

/** Store browsing filters, parsed from URL search params. */
export const gameQuery = z.object({
  q: z.string().trim().max(100).optional().catch(undefined),
  category: z.enum(CATEGORIES).optional().catch(undefined),
  platform: z.enum(PLATFORMS).optional().catch(undefined),
  /** Maximum price in whole dollars; 0 means free games only. */
  maxPrice: z.coerce.number().int().min(0).max(1000).optional().catch(undefined),
  sort: z.enum(SORTS).default('newest').catch('newest'),
  page: z.coerce.number().int().min(1).max(500).default(1).catch(1),
})
export type GameQuery = z.infer<typeof gameQuery>
export type GameQueryInput = z.input<typeof gameQuery>

export function parseGameQuery(params: Record<string, string | string[] | undefined>) {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
  return gameQuery.parse(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, first(v) || undefined])))
}

/**
 * Everything the UI needs from the data layer. Implemented twice: by SQLite
 * via Drizzle (`db-store.ts`) and by the in-memory catalog (`static-store.ts`).
 * Both run the same contract tests.
 */
export interface Store {
  readonly kind: 'database' | 'static'
  listGames(query: GameQuery, pageSize?: number): Promise<Page<GameSummary>>
  featuredGames(): Promise<GameDetails[]>
  getGame(slug: string): Promise<GameDetails | null>
  similarGames(slug: string, limit?: number): Promise<GameSummary[]>
  /** Slugs of the games a user owns. Always empty without a database. */
  ownedSlugs(userId: string): Promise<Set<string>>
  library(userId: string): Promise<GameSummary[]>
  /** Adds a game to a library; returns false if it was already owned. */
  addToLibrary(userId: string, slug: string, reference?: string): Promise<boolean>
}

export const DEFAULT_PAGE_SIZE = 12
