import FeaturedGames from '@/components/FeaturedGames'
import FeaturedSkeleton from '@/components/FeaturedGames/FeaturedSkeleton'
import { useGames } from '@/lib/games'
import React, { Suspense } from 'react'

async function FeaturedSection() {
  let featuredGames = (await useGames(1)).data.slice(0, 4) || null
  return (
    <Suspense fallback={<FeaturedSkeleton />}>
      <FeaturedGames games={featuredGames} />
    </Suspense>
  )
}

export default FeaturedSection
