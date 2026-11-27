import { Suspense } from 'react'
import { FeaturedCarousel } from '@/components/games/featured-carousel'
import { GamesGrid, GamesGridSkeleton } from '@/components/games/game-card'
import { Pagination } from '@/components/games/pagination'
import { getUserId } from '@/lib/auth'
import { getStore } from '@/lib/store'
import { parseGameQuery } from '@/lib/store/types'
import { withParams } from '@/lib/utils'

export default function StorePage({ searchParams }: PageProps<'/'>) {
  return (
    <div className="flex flex-col gap-14">
      <Suspense fallback={<div className="h-[380px] animate-pulse rounded-2xl bg-store-800 md:h-[520px]" />}>
        <Featured />
      </Suspense>
      <section aria-labelledby="new-heading">
        <h2 id="new-heading" className="mb-6 text-2xl font-semibold">
          New releases
        </h2>
        <Suspense fallback={<GamesGridSkeleton />}>
          <NewReleases searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  )
}

async function Featured() {
  const store = await getStore()
  return <FeaturedCarousel games={await store.featuredGames()} />
}

async function NewReleases({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const query = parseGameQuery(await searchParams)
  const [store, userId] = await Promise.all([getStore(), getUserId()])
  const [page, owned] = await Promise.all([
    store.listGames({ ...query, q: undefined, category: undefined, platform: undefined, maxPrice: undefined, sort: 'newest' }, 10),
    userId ? store.ownedSlugs(userId) : Promise.resolve(new Set<string>()),
  ])

  return (
    <>
      <GamesGrid games={page.items} owned={owned} />
      <Pagination page={page.page} hasNextPage={page.hasNextPage} href={(p) => withParams('/', {}, { page: p })} />
    </>
  )
}
