import { and, asc, count, desc, eq, exists, inArray, lte, ne, or, sql, type SQL } from 'drizzle-orm'
import type { Db } from '@/db/client'
import {
  categories,
  gameCategories,
  gamePlatforms,
  games,
  libraryItems,
  platforms,
} from '@/db/schema'
import { DEFAULT_PAGE_SIZE, type GameDetails, type GameQuery, type Store } from './types'

const summaryColumns = {
  slug: games.slug,
  title: games.title,
  developer: games.developer,
  priceCents: games.priceCents,
  releasedAt: games.releasedAt,
}

/** `%`, `_` and `\` are wildcards in LIKE; escape them so search is literal. */
function likePattern(text: string) {
  return `%${text.replace(/[\\%_]/g, (char) => `\\${char}`)}%`
}

function filters(db: Db, query: GameQuery): SQL | undefined {
  const conditions: (SQL | undefined)[] = []

  if (query.q) {
    const pattern = likePattern(query.q)
    conditions.push(
      or(sql`${games.title} like ${pattern} escape '\\'`, sql`${games.developer} like ${pattern} escape '\\'`),
    )
  }

  // Filter through the join tables. (The 2023 version joined games.id to
  // categories.id directly, which matched unrelated rows.)
  if (query.category) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(gameCategories)
          .innerJoin(categories, eq(categories.id, gameCategories.categoryId))
          .where(and(eq(gameCategories.gameId, games.id), eq(categories.name, query.category))),
      ),
    )
  }

  if (query.platform) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(gamePlatforms)
          .innerJoin(platforms, eq(platforms.id, gamePlatforms.platformId))
          .where(and(eq(gamePlatforms.gameId, games.id), eq(platforms.name, query.platform))),
      ),
    )
  }

  if (query.maxPrice !== undefined) conditions.push(lte(games.priceCents, query.maxPrice * 100))

  return and(...conditions)
}

const orderings = {
  newest: [desc(games.releasedAt), asc(games.title)],
  'price-asc': [asc(games.priceCents), asc(games.title)],
  'price-desc': [desc(games.priceCents), asc(games.title)],
  title: [asc(games.title)],
} as const

async function loadDetails(db: Db, where: SQL): Promise<GameDetails[]> {
  const rows = await db.query.games.findMany({
    where,
    with: {
      categories: { with: { category: true } },
      platforms: { with: { platform: true } },
    },
    orderBy: [desc(games.releasedAt)],
  })
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    developer: row.developer,
    priceCents: row.priceCents,
    releasedAt: row.releasedAt,
    description: row.description,
    screenshots: row.screenshots,
    categories: row.categories.map((link) => link.category.name).sort(),
    platforms: row.platforms.map((link) => link.platform.name).sort(),
  }))
}

/** Store backed by SQLite (a local file or Turso) through Drizzle. */
export function createDbStore(db: Db): Store {
  return {
    kind: 'database',

    async listGames(query, pageSize = DEFAULT_PAGE_SIZE) {
      const where = filters(db, query)
      const [rows, [{ total }]] = await Promise.all([
        db
          .select(summaryColumns)
          .from(games)
          .where(where)
          .orderBy(...orderings[query.sort])
          .limit(pageSize)
          .offset((query.page - 1) * pageSize),
        db.select({ total: count() }).from(games).where(where),
      ])
      return {
        items: rows,
        page: query.page,
        pageSize,
        total,
        hasNextPage: query.page * pageSize < total,
      }
    },

    async featuredGames() {
      return loadDetails(db, eq(games.featured, true))
    },

    async getGame(slug) {
      const [game] = await loadDetails(db, eq(games.slug, slug))
      return game ?? null
    },

    async similarGames(slug, limit = 4) {
      const [game] = await db.select({ id: games.id }).from(games).where(eq(games.slug, slug))
      if (!game) return []

      const ownCategories = db
        .select({ id: gameCategories.categoryId })
        .from(gameCategories)
        .where(eq(gameCategories.gameId, game.id))
      const shared = count(gameCategories.categoryId)

      return db
        .select(summaryColumns)
        .from(games)
        .innerJoin(gameCategories, eq(gameCategories.gameId, games.id))
        .where(and(ne(games.id, game.id), inArray(gameCategories.categoryId, ownCategories)))
        .groupBy(games.id)
        .orderBy(desc(shared), asc(games.title))
        .limit(limit)
    },

    async ownedSlugs(userId) {
      const rows = await db
        .select({ slug: games.slug })
        .from(libraryItems)
        .innerJoin(games, eq(games.id, libraryItems.gameId))
        .where(eq(libraryItems.userId, userId))
      return new Set(rows.map((row) => row.slug))
    },

    async library(userId) {
      return db
        .select(summaryColumns)
        .from(libraryItems)
        .innerJoin(games, eq(games.id, libraryItems.gameId))
        .where(eq(libraryItems.userId, userId))
        .orderBy(desc(libraryItems.acquiredAt), asc(games.title))
    },

    async addToLibrary(userId, slug, reference) {
      const [game] = await db.select({ id: games.id }).from(games).where(eq(games.slug, slug))
      if (!game) throw new Error(`Unknown game: ${slug}`)
      // The (user, game) primary key makes repeated webhooks harmless.
      const inserted = await db
        .insert(libraryItems)
        .values({ userId, gameId: game.id, reference })
        .onConflictDoNothing()
        .returning({ gameId: libraryItems.gameId })
      return inserted.length > 0
    },
  }
}
