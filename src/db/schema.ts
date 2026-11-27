import { relations, sql } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const games = sqliteTable(
  'games',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    developer: text('developer').notNull(),
    description: text('description').notNull(),
    /** Integer cents: never store money as floats. */
    priceCents: integer('price_cents').notNull(),
    releasedAt: text('released_at').notNull(),
    featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
    screenshots: integer('screenshots').notNull().default(0),
  },
  (t) => [
    uniqueIndex('games_slug_idx').on(t.slug),
    index('games_released_idx').on(t.releasedAt),
    index('games_price_idx').on(t.priceCents),
  ],
)

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
})

export const platforms = sqliteTable('platforms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
})

export const gameCategories = sqliteTable(
  'game_categories',
  {
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.categoryId] }), index('game_categories_category_idx').on(t.categoryId)],
)

export const gamePlatforms = sqliteTable(
  'game_platforms',
  {
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    platformId: integer('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.gameId, t.platformId] }), index('game_platforms_platform_idx').on(t.platformId)],
)

/**
 * Games a user owns. Users live in Clerk, so `userId` is the Clerk user id and
 * there is no local users table to keep in sync.
 */
export const libraryItems = sqliteTable(
  'library_items',
  {
    userId: text('user_id').notNull(),
    gameId: integer('game_id')
      .notNull()
      .references(() => games.id, { onDelete: 'cascade' }),
    /** Stripe Checkout session id (or "free"), for auditing and idempotency. */
    reference: text('reference'),
    acquiredAt: text('acquired_at')
      .notNull()
      .default(sql`(CURRENT_TIMESTAMP)`),
  },
  (t) => [primaryKey({ columns: [t.userId, t.gameId] })],
)

export const gamesRelations = relations(games, ({ many }) => ({
  categories: many(gameCategories),
  platforms: many(gamePlatforms),
}))

export const gameCategoriesRelations = relations(gameCategories, ({ one }) => ({
  game: one(games, { fields: [gameCategories.gameId], references: [games.id] }),
  category: one(categories, { fields: [gameCategories.categoryId], references: [categories.id] }),
}))

export const gamePlatformsRelations = relations(gamePlatforms, ({ one }) => ({
  game: one(games, { fields: [gamePlatforms.gameId], references: [games.id] }),
  platform: one(platforms, { fields: [gamePlatforms.platformId], references: [platforms.id] }),
}))
