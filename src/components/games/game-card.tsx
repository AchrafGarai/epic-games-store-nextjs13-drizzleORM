import Image from 'next/image'
import Link from 'next/link'
import type { GameSummary } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export function GameCard({ game, owned }: { game: GameSummary; owned?: boolean }) {
  return (
    <Link href={`/games/${game.slug}`} className="group flex flex-col gap-3 rounded-xl">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-store-800">
        <Image
          src={`/media/${game.slug}/cover`}
          alt=""
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 768px) 30vw, 45vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-store-500">{game.developer}</span>
        <span className="font-semibold leading-tight">{game.title}</span>
        <span className="text-sm text-store-300">{owned ? 'In library' : formatPrice(game.priceCents)}</span>
      </div>
    </Link>
  )
}

export function GamesGrid({
  games,
  owned,
  columns = 'default',
}: {
  games: GameSummary[]
  owned?: Set<string>
  columns?: 'default' | 'narrow'
}) {
  return (
    <ul
      className={
        columns === 'default'
          ? 'grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          : 'grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4'
      }
    >
      {games.map((game) => (
        <li key={game.slug}>
          <GameCard game={game} owned={owned?.has(game.slug)} />
        </li>
      ))}
    </ul>
  )
}

export function GamesGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="flex flex-col gap-3">
          <div className="aspect-[3/4] animate-pulse rounded-xl bg-store-800" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-store-800" />
        </li>
      ))}
    </ul>
  )
}
