import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { GamesGrid } from '@/components/games/game-card'
import { MediaGallery } from '@/components/games/media-gallery'
import { PurchaseButton } from '@/components/games/purchase-button'
import { features } from '@/config/env'
import { catalog } from '@/data/catalog'
import { getUserId } from '@/lib/auth'
import { getStore } from '@/lib/store'
import { formatDate, formatPrice } from '@/lib/utils'

export function generateStaticParams() {
  return catalog.map((game) => ({ slug: game.slug }))
}

export async function generateMetadata({ params }: PageProps<'/games/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const game = catalog.find((candidate) => candidate.slug === slug)
  if (!game) return { title: 'Game not found' }
  return {
    title: game.title,
    description: game.description,
    openGraph: { images: [`/media/${slug}/banner`] },
  }
}

export default function GamePage({ params, searchParams }: PageProps<'/games/[slug]'>) {
  return (
    <Suspense fallback={<div className="aspect-video animate-pulse rounded-xl bg-store-800" />}>
      <Game params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function Game({ params, searchParams }: PageProps<'/games/[slug]'>) {
  const [{ slug }, { purchase }] = await Promise.all([params, searchParams])
  const [store, userId] = await Promise.all([getStore(), getUserId()])
  const [game, similar, owned] = await Promise.all([
    store.getGame(slug),
    store.similarGames(slug, 5),
    userId ? store.ownedSlugs(userId) : Promise.resolve(new Set<string>()),
  ])
  if (!game) notFound()

  const isOwned = owned.has(slug)
  const mode =
    store.kind === 'static' || !features.auth ? 'disabled' : features.payments ? 'checkout' : 'direct'

  return (
    <article className="flex flex-col gap-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-8">
          <header>
            <p className="text-sm text-store-500">{game.developer}</p>
            <h1 className="text-4xl font-bold">{game.title}</h1>
          </header>
          {purchase === 'success' && (
            <p role="status" className="rounded-xl bg-accent/10 px-4 py-3 text-accent">
              Thanks for your purchase! It will appear in your library as soon as Stripe confirms the payment.
            </p>
          )}
          <MediaGallery slug={game.slug} title={game.title} count={game.screenshots} />
          <section>
            <h2 className="mb-3 text-lg font-semibold">About the game</h2>
            <p className="max-w-prose leading-relaxed text-store-300">{game.description}</p>
          </section>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <Image
            src={`/media/${game.slug}/cover`}
            alt={`${game.title} cover art`}
            width={600}
            height={800}
            className="hidden aspect-[3/4] w-full rounded-xl object-cover lg:block"
          />
          <p className="text-2xl font-semibold">{formatPrice(game.priceCents)}</p>
          <PurchaseButton slug={game.slug} priceCents={game.priceCents} owned={isOwned} mode={mode} />
          <dl className="divide-y divide-store-800 text-sm">
            {[
              ['Developer', game.developer],
              ['Release date', formatDate(game.releasedAt)],
              ['Genres', game.categories.join(', ')],
              ['Platforms', game.platforms.join(', ')],
            ].map(([term, detail]) => (
              <div key={term} className="flex justify-between gap-4 py-3">
                <dt className="text-store-500">{term}</dt>
                <dd className="text-right">{detail}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="mb-6 text-2xl font-semibold">
            You might also like
          </h2>
          <GamesGrid games={similar} owned={owned} />
        </section>
      )}
    </article>
  )
}
