import GameDetails from '@/components/Games/GameDetails'
import GameMedia from '@/components/Games/GameMedia'
import { Category, Game } from '@/db/game/schema'
import { Media, media } from '@/db/media/schema'
import { Platform } from '@/db/platforms/schema'
import { auth } from '@clerk/nextjs/server'
import { getCategoryNames } from '@/utils/helpers/Games'

import Image from 'next/image'
import React from 'react'
import SimilarGames from './SimilarGames'

type Props = {
  params: { id: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}
async function GameDetailsPage({ params, searchParams }: Props) {
  const { id } = params
  const activeImage = Number(searchParams?.image)
  const { getToken } = auth()
  // Response type
  type Response = {
    data: Game & {
      media: Media[]
      platforms: {
        platform: Platform
      }[]
      categories: {
        category: Category
      }[]
    }
    isOwned: boolean
  }

  const { data, isOwned } = (await fetch(
    `${process.env.BASE_URL}/api/game/${id}`,
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    },
  )
    .then((res) => res.json())
    .catch((e) => console.log(e))) as Response
  const game = data

  const relatedCategories = getCategoryNames(game.categories)
    .split(',')
    .join('|')

  return (
    game && (
      <div className=" pb-24">
        <div className="flex gap-8">
          <div className="flex-grow ">
            <p className=" text-4xl font-medium my-5">{game.title}</p>
            {media && (
              <GameMedia
                media={game.media}
                gameId={id}
                activeMedia={activeImage}
              />
            )}
            <div className=" my-12">
              <h4 className=" text-lg mb-4 font-medium ">Description</h4>
              <p className=" text-neutral-400">{game.gameDescription}</p>
            </div>
          </div>
          <GameDetails game={game} isOwned={isOwned} />
          {/* </div> */}
        </div>
        <>
          {relatedCategories && relatedCategories !== '' && (
            <>
              <h4 className=" text-lg mb-4 font-medium">Similar Games</h4>
              <SimilarGames
                gameId={game.id}
                relatedCategories={relatedCategories}
                searchParams={searchParams}
              />
            </>
          )}
        </>
      </div>
    )
  )
}

export default GameDetailsPage
