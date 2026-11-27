import { migrate } from 'drizzle-orm/libsql/migrator'
import { beforeAll, describe, expect, it } from 'vitest'
import { catalog } from '@/data/catalog'
import { createDb } from '@/db/client'
import { seedCatalog } from '@/db/seed-data'
import { createDbStore } from './db-store'
import { createStaticStore } from './static-store'
import { gameQuery, parseGameQuery, type GameQueryInput, type Store } from './types'

const query = (input: GameQueryInput = {}) => gameQuery.parse(input)

async function databaseStore() {
  const db = createDb(':memory:')
  await migrate(db, { migrationsFolder: 'drizzle' })
  await seedCatalog(db)
  return createDbStore(db)
}

/**
 * The same behaviour is required from both stores, so the static fallback
 * can never drift from what the database returns.
 */
describe.each([
  ['static', async () => createStaticStore()],
  ['database', databaseStore],
] as const)('%s store', (_name, create) => {
  let store: Store
  beforeAll(async () => {
    store = await create()
  })

  it('lists the newest games first, paginated', async () => {
    const first = await store.listGames(query(), 5)
    expect(first.total).toBe(catalog.length)
    expect(first.items).toHaveLength(5)
    expect(first.hasNextPage).toBe(true)
    const dates = first.items.map((game) => game.releasedAt)
    expect(dates).toEqual([...dates].sort().reverse())

    const last = await store.listGames(query({ page: Math.ceil(catalog.length / 5) }), 5)
    expect(last.hasNextPage).toBe(false)
  })

  it('searches title and developer, case-insensitively', async () => {
    const byTitle = await store.listGames(query({ q: 'tide' }))
    expect(byTitle.items.map((game) => game.slug)).toEqual(['tidebound'])

    const byDeveloper = await store.listGames(query({ q: 'MERIDIAN' }))
    expect(byDeveloper.items.map((game) => game.slug).sort()).toEqual(['kingdoms-of-salt', 'starfall-dominion'])
  })

  it('treats LIKE wildcards in search as plain text', async () => {
    expect((await store.listGames(query({ q: '%' }))).total).toBe(0)
    expect((await store.listGames(query({ q: '_' }))).total).toBe(0)
  })

  it('filters by category and platform through the join tables', async () => {
    const racing = await store.listGames(query({ category: 'Racing' }))
    expect(racing.items.map((game) => game.slug).sort()).toEqual(['circuit-saints', 'neon-drift-free'])

    const linuxRpgs = await store.listGames(query({ category: 'RPG', platform: 'Linux' }))
    expect(linuxRpgs.items.map((game) => game.slug)).toEqual(['lanternwake'])
  })

  it('filters by maximum price, with 0 meaning free', async () => {
    const free = await store.listGames(query({ maxPrice: 0 }))
    expect(free.items.every((game) => game.priceCents === 0)).toBe(true)
    expect(free.total).toBe(2)

    const cheap = await store.listGames(query({ maxPrice: 20, sort: 'price-desc' }))
    expect(cheap.items[0].priceCents).toBeLessThanOrEqual(2000)
  })

  it('sorts by price and title', async () => {
    const ascending = (await store.listGames(query({ sort: 'price-asc' }), 50)).items.map((g) => g.priceCents)
    expect(ascending).toEqual([...ascending].sort((a, b) => a - b))

    const titles = (await store.listGames(query({ sort: 'title' }), 50)).items.map((g) => g.title)
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)))
  })

  it('returns game details with categories and platforms', async () => {
    const game = await store.getGame('lanternwake')
    expect(game).toMatchObject({
      title: 'Lanternwake',
      categories: ['Indie', 'RPG'],
      platforms: ['Linux', 'Windows', 'macOS'].sort(),
    })
    expect(await store.getGame('does-not-exist')).toBeNull()
  })

  it('returns featured games', async () => {
    const featured = await store.featuredGames()
    expect(featured.map((game) => game.slug).sort()).toEqual(
      catalog.filter((game) => game.featured).map((game) => game.slug).sort(),
    )
  })

  it('suggests similar games by shared categories, never the game itself', async () => {
    const source = catalog.find((game) => game.slug === 'the-quiet-archive')!
    const similar = await store.similarGames(source.slug, 4)
    const overlap = (slug: string) =>
      catalog.find((game) => game.slug === slug)!.categories.filter((c) => source.categories.includes(c)).length

    expect(similar).toHaveLength(4)
    expect(similar.map((game) => game.slug)).not.toContain(source.slug)
    const overlaps = similar.map((game) => overlap(game.slug))
    expect(overlaps.every((n) => n > 0)).toBe(true)
    expect(overlaps).toEqual([...overlaps].sort((a, b) => b - a))
  })
})

describe('database store library', () => {
  it('adds a game once and ignores duplicate fulfilment', async () => {
    const store = await databaseStore()
    expect(await store.addToLibrary('user_1', 'tidebound', 'cs_test_1')).toBe(true)
    expect(await store.addToLibrary('user_1', 'tidebound', 'cs_test_1')).toBe(false)
    expect([...(await store.ownedSlugs('user_1'))]).toEqual(['tidebound'])
    expect((await store.library('user_1')).map((game) => game.slug)).toEqual(['tidebound'])
    expect(await store.ownedSlugs('user_2')).toEqual(new Set())
  })
})

describe('parseGameQuery', () => {
  it('ignores invalid values instead of failing the page', () => {
    expect(parseGameQuery({ category: 'Nope', maxPrice: '-5', page: 'x', sort: 'weird' })).toEqual({
      q: undefined,
      category: undefined,
      platform: undefined,
      maxPrice: undefined,
      sort: 'newest',
      page: 1,
    })
  })

  it('takes the first value of repeated params', () => {
    expect(parseGameQuery({ q: ['tide', 'other'] }).q).toBe('tide')
  })
})

describe('static fallback parity', () => {
  it('returns exactly what the database returns', async () => {
    const [database, fallback] = [await databaseStore(), createStaticStore()]
    const queries: GameQueryInput[] = [
      {},
      { sort: 'price-asc' },
      { sort: 'title', page: 2 },
      { category: 'Indie', sort: 'price-desc' },
      { platform: 'macOS', maxPrice: 25 },
      { q: 'saint' },
    ]
    for (const input of queries) {
      expect(await fallback.listGames(query(input), 6)).toEqual(await database.listGames(query(input), 6))
    }
    for (const { slug } of catalog) {
      expect(await fallback.getGame(slug)).toEqual(await database.getGame(slug))
      expect(await fallback.similarGames(slug)).toEqual(await database.similarGames(slug))
    }
  })
})
