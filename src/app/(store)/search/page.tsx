import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { GamesGrid, GamesGridSkeleton } from '@/components/games/game-card'
import { Pagination } from '@/components/games/pagination'
import { buttonVariants } from '@/components/ui/button'
import { CATEGORIES, PLATFORMS } from '@/data/catalog'
import { getUserId } from '@/lib/auth'
import { getStore } from '@/lib/store'
import { parseGameQuery, type GameQuery } from '@/lib/store/types'
import { withParams } from '@/lib/utils'

export const metadata: Metadata = { title: 'Browse' }

const PRICE_OPTIONS = [
  { value: '', label: 'Any price' },
  { value: '0', label: 'Free' },
  { value: '10', label: 'Under $10' },
  { value: '20', label: 'Under $20' },
  { value: '30', label: 'Under $30' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'title', label: 'Alphabetical' },
]

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <Suspense fallback={<GamesGridSkeleton />}>
      <Results searchParams={searchParams} />
    </Suspense>
  )
}

function asParams(query: GameQuery) {
  return {
    q: query.q,
    category: query.category,
    platform: query.platform,
    maxPrice: query.maxPrice,
    sort: query.sort === 'newest' ? undefined : query.sort,
    page: query.page,
  }
}

async function Results({ searchParams }: Pick<PageProps<'/search'>, 'searchParams'>) {
  const query = parseGameQuery(await searchParams)
  const [store, userId] = await Promise.all([getStore(), getUserId()])
  const [results, owned] = await Promise.all([
    store.listGames(query),
    userId ? store.ownedSlugs(userId) : Promise.resolve(new Set<string>()),
  ])
  const current = asParams(query)
  const filtered = Boolean(query.q || query.category || query.platform || query.maxPrice !== undefined)

  return (
    <div className="flex flex-col gap-8 lg:flex-row-reverse">
      <aside className="lg:w-64 lg:shrink-0">
        {/* A GET form: filters work without JavaScript and every result has a shareable URL. */}
        <form action="/search" className="flex flex-col gap-4 rounded-2xl bg-store-950 p-5">
          <h2 className="font-semibold">Filters</h2>
          {query.q && <input type="hidden" name="q" value={query.q} />}
          <Select name="category" label="Genre" value={query.category} options={[{ value: '', label: 'All genres' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]} />
          <Select name="platform" label="Platform" value={query.platform} options={[{ value: '', label: 'All platforms' }, ...PLATFORMS.map((p) => ({ value: p, label: p }))]} />
          <Select name="maxPrice" label="Price" value={query.maxPrice?.toString()} options={PRICE_OPTIONS} />
          <Select name="sort" label="Sort by" value={query.sort} options={SORT_OPTIONS} />
          <button type="submit" className={buttonVariants()}>
            Apply
          </button>
          {filtered && (
            <Link href="/search" className={buttonVariants({ variant: 'ghost' })}>
              Clear filters
            </Link>
          )}
        </form>
      </aside>

      <section className="min-w-0 flex-1" aria-labelledby="results-heading">
        <h1 id="results-heading" className="mb-6 text-2xl font-semibold">
          {query.q ? `Results for “${query.q}”` : 'Browse games'}{' '}
          <span className="text-base font-normal text-store-500">({results.total})</span>
        </h1>
        {results.items.length ? (
          <GamesGrid games={results.items} owned={owned} columns="narrow" />
        ) : (
          <p className="rounded-2xl border border-dashed border-store-700 p-10 text-center text-store-300">
            No games match these filters.
          </p>
        )}
        <Pagination
          page={results.page}
          hasNextPage={results.hasNextPage}
          href={(page) => withParams('/search', current, { page })}
        />
      </section>
    </div>
  )
}

function Select({
  name,
  label,
  value,
  options,
}: {
  name: string
  label: string
  value?: string
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-store-300">{label}</span>
      <select
        name={name}
        defaultValue={value ?? ''}
        className="h-10 rounded-lg bg-store-800 px-3 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
