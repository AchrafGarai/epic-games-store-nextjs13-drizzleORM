import { GamesGrid } from '@/components/Games'
import { useGames } from '@/lib/games'
import React, { Suspense } from 'react'

type Props = {
  relatedCategories?: string
  searchParams?: { [key: string]: string | string[] | undefined }
  gameId: number
}
async function SimilarGames({ relatedCategories, gameId }: Props) {
  const page = 1
  const pageSize = 3
  const categoriesQuery = {
    categories: relatedCategories,
  }
  const similarGames = await useGames(
    page,
    categoriesQuery,
    `game/${gameId}/similar-games`,
    pageSize,
  )

  return (
    <Suspense fallback={<SimilarGamesSkeleton />}>
      <div className="mb-12">
        <GamesGrid games={similarGames.data} />
      </div>
    </Suspense>
  )
}

export default SimilarGames

export function SimilarGamesSkeleton() {
  return (
    <div className=" animate-pulse grid grid-cols-2 gap-8 lg:grid-cols-4 ">
      <div className="bg-neutral-800 rounded-md mb-6 h-28"></div>
      <div className="bg-neutral-800 rounded-md mb-6 h-28"></div>
      <div className="bg-neutral-800 rounded-md mb-6 h-28"></div>
      <div className="bg-neutral-800 rounded-md mb-6 h-28"></div>
    </div>
  )
}
