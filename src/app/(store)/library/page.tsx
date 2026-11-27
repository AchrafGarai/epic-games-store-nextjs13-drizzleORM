import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { GamesGrid, GamesGridSkeleton } from '@/components/games/game-card'
import { buttonVariants } from '@/components/ui/button'
import { features } from '@/config/env'
import { getUserId } from '@/lib/auth'
import { getStore } from '@/lib/store'

export const metadata: Metadata = { title: 'Library' }

export default function LibraryPage() {
  return (
    <section aria-labelledby="library-heading">
      <h1 id="library-heading" className="mb-8 text-4xl font-bold">
        Library
      </h1>
      <Suspense fallback={<GamesGridSkeleton count={5} />}>
        <Library />
      </Suspense>
    </section>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-store-700 p-12 text-center text-store-300">
      {children}
    </div>
  )
}

async function Library() {
  const store = await getStore()
  if (store.kind === 'static' || !features.auth) {
    return (
      <Notice>
        <p>The library needs a database and sign-in. This deployment is a read-only demo.</p>
        <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
          Browse the store
        </Link>
      </Notice>
    )
  }

  const userId = await getUserId()
  if (!userId) redirect('/sign-in?redirect_url=/library')

  const games = await store.library(userId)
  if (games.length === 0) {
    return (
      <Notice>
        <p>You don’t own any games yet. Free games are a good place to start.</p>
        <Link href="/search?maxPrice=0" className={buttonVariants()}>
          Browse free games
        </Link>
      </Notice>
    )
  }
  return <GamesGrid games={games} owned={new Set(games.map((game) => game.slug))} />
}
