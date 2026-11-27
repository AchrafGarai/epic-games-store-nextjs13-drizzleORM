import { catalog, type CatalogGame } from '@/data/catalog'
import { DEFAULT_PAGE_SIZE, type GameDetails, type GameQuery, type GameSummary, type Store } from './types'

const toSummary = (game: CatalogGame): GameSummary => ({
  slug: game.slug,
  title: game.title,
  developer: game.developer,
  priceCents: game.priceCents,
  releasedAt: game.releasedAt,
})

const toDetails = (game: CatalogGame): GameDetails => ({
  ...toSummary(game),
  description: game.description,
  categories: [...game.categories].sort(),
  platforms: [...game.platforms].sort(),
  screenshots: game.screenshots,
})

const sorters: Record<GameQuery['sort'], (a: CatalogGame, b: CatalogGame) => number> = {
  newest: (a, b) => b.releasedAt.localeCompare(a.releasedAt) || a.title.localeCompare(b.title),
  'price-asc': (a, b) => a.priceCents - b.priceCents || a.title.localeCompare(b.title),
  'price-desc': (a, b) => b.priceCents - a.priceCents || a.title.localeCompare(b.title),
  title: (a, b) => a.title.localeCompare(b.title),
}

export function matchesQuery(game: CatalogGame, query: GameQuery) {
  if (query.q) {
    const needle = query.q.toLowerCase()
    if (!game.title.toLowerCase().includes(needle) && !game.developer.toLowerCase().includes(needle)) {
      return false
    }
  }
  if (query.category && !game.categories.includes(query.category)) return false
  if (query.platform && !game.platforms.includes(query.platform)) return false
  if (query.maxPrice !== undefined && game.priceCents > query.maxPrice * 100) return false
  return true
}

/** Read-only store backed by the bundled catalog. Libraries are always empty. */
export function createStaticStore(games: CatalogGame[] = catalog): Store {
  return {
    kind: 'static',

    async listGames(query, pageSize = DEFAULT_PAGE_SIZE) {
      const matching = games.filter((game) => matchesQuery(game, query)).sort(sorters[query.sort])
      const start = (query.page - 1) * pageSize
      return {
        items: matching.slice(start, start + pageSize).map(toSummary),
        page: query.page,
        pageSize,
        total: matching.length,
        hasNextPage: start + pageSize < matching.length,
      }
    },

    async featuredGames() {
      return games.filter((game) => game.featured).map(toDetails)
    },

    async getGame(slug) {
      const game = games.find((candidate) => candidate.slug === slug)
      return game ? toDetails(game) : null
    },

    async similarGames(slug, limit = 4) {
      const game = games.find((candidate) => candidate.slug === slug)
      if (!game) return []
      return games
        .filter((other) => other.slug !== slug)
        .map((other) => ({
          other,
          shared: other.categories.filter((c) => game.categories.includes(c)).length,
        }))
        .filter(({ shared }) => shared > 0)
        .sort((a, b) => b.shared - a.shared || a.other.title.localeCompare(b.other.title))
        .slice(0, limit)
        .map(({ other }) => toSummary(other))
    },

    async ownedSlugs() {
      return new Set()
    },

    async library() {
      return []
    },

    async addToLibrary() {
      throw new Error('The static store is read-only')
    },
  }
}
