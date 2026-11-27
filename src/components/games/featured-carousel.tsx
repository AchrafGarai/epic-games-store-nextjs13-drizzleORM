'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import type { GameDetails } from '@/lib/store'
import { cn, formatPrice } from '@/lib/utils'

const ROTATE_MS = 7000

/** Hero banner with a thumbnail rail; rotates until the user picks a game. */
export function FeaturedCarousel({ games }: { games: GameDetails[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const game = games[index]

  useEffect(() => {
    if (paused || games.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setTimeout(() => setIndex((current) => (current + 1) % games.length), ROTATE_MS)
    return () => clearTimeout(timer)
  }, [index, paused, games.length])

  if (!game) return null

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured games"
      className="grid gap-6 lg:grid-cols-[1fr_260px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
    >
      <div className="relative h-[380px] overflow-hidden rounded-2xl md:h-[520px]" aria-live="polite">
        {games.map((item, i) => (
          <Image
            key={item.slug}
            src={`/media/${item.slug}/banner`}
            alt=""
            fill
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            sizes="(min-width: 1024px) 70vw, 100vw"
            className={cn('object-cover transition-opacity duration-700', i === index ? 'opacity-100' : 'opacity-0')}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex max-w-lg flex-col items-start gap-3 p-6 md:p-12">
          <p className="text-xs font-semibold tracking-widest text-store-300 uppercase">{game.developer}</p>
          <h2 className="text-3xl font-bold md:text-4xl">{game.title}</h2>
          <p className="line-clamp-2 text-store-300">{game.description}</p>
          <p className="font-semibold">{formatPrice(game.priceCents)}</p>
          <Link href={`/games/${game.slug}`} className={buttonVariants({ size: 'lg' })}>
            {game.priceCents === 0 ? 'Get it free' : 'Buy now'}
          </Link>
        </div>
      </div>

      <ul className="grid auto-rows-min grid-cols-2 gap-2 lg:grid-cols-1">
        {games.map((item, i) => (
          <li key={item.slug}>
            <button
              type="button"
              onClick={() => {
                setIndex(i)
                setPaused(true)
              }}
              aria-current={i === index ? 'true' : undefined}
              className={cn(
                'relative flex w-full items-center gap-3 overflow-hidden rounded-xl p-3 text-left transition-colors hover:bg-store-800',
                i === index && 'bg-store-800',
              )}
            >
              <Image
                src={`/media/${item.slug}/cover`}
                alt=""
                width={48}
                height={64}
                className="h-16 w-12 shrink-0 rounded-md object-cover"
              />
              <span className="text-sm font-medium">{item.title}</span>
              {i === index && !paused && (
                <span
                  key={index}
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 bg-accent motion-safe:animate-[progress_7s_linear_forwards]"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
