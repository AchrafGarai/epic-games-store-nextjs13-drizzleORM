'use client'
import React, { useEffect, useState } from 'react'
import FeaturedBanner from './FeaturedBanner'
import FeaturedThumbnail from './FeaturedThumbnail'
import { useGames } from '@/lib/games'
import { Game } from '@/db/game/schema'
type Props = {
  games: Game[]
  featuredGame?: number
  page: number
}

async function FeaturedGames({ featuredGame, page, games }: Props) {
  const [featured, setFeatured] = useState<Game>()

  useEffect(() => {
    setFeatured(games[0])
    console.log(featured)
  }, [])

  return (
    <div className="grid grid-cols-8 gap-8 ">
      <FeaturedBanner game={featured} />
      <ul className=" col-span-8 md:col-span-2">
        {games.map((game) => (
          <li key={game.id}>
            <FeaturedThumbnail
              onThumbnailClick={(value) => setFeatured(value)}
              page={page}
              game={game}
              variant={game.id === featured?.id ? 'selected' : 'default'}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FeaturedGames

export const revalidate = 10
