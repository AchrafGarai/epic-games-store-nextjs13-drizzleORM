import { catalog, CATEGORIES, PLATFORMS } from '@/data/catalog'
import type { Db } from './client'
import { categories, gameCategories, gamePlatforms, games, platforms } from './schema'

/** Upserts the catalog into the database. Safe to run repeatedly. */
export async function seedCatalog(db: Db) {
  await db
    .insert(categories)
    .values(CATEGORIES.map((name) => ({ name })))
    .onConflictDoNothing()
  await db
    .insert(platforms)
    .values(PLATFORMS.map((name) => ({ name })))
    .onConflictDoNothing()

  const categoryIds = new Map((await db.select().from(categories)).map((row) => [row.name, row.id]))
  const platformIds = new Map((await db.select().from(platforms)).map((row) => [row.name, row.id]))

  for (const game of catalog) {
    const values = {
      slug: game.slug,
      title: game.title,
      developer: game.developer,
      description: game.description,
      priceCents: game.priceCents,
      releasedAt: game.releasedAt,
      featured: game.featured ?? false,
      screenshots: game.screenshots,
    }
    const [{ id }] = await db
      .insert(games)
      .values(values)
      .onConflictDoUpdate({ target: games.slug, set: values })
      .returning({ id: games.id })

    await db
      .insert(gameCategories)
      .values(game.categories.map((name) => ({ gameId: id, categoryId: categoryIds.get(name)! })))
      .onConflictDoNothing()
    await db
      .insert(gamePlatforms)
      .values(game.platforms.map((name) => ({ gameId: id, platformId: platformIds.get(name)! })))
      .onConflictDoNothing()
  }

  return catalog.length
}
