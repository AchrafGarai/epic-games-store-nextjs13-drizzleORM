import { Game } from '@/db/game/schema'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import DataCell from '@/components/ui/data-cell'
import { Button } from '@/components/ui/button'
import { Media } from '@/db/media/schema'
import { Platform } from '@/db/platforms/schema'
import { Category } from '@/db/game/schema'
import { getCategoryNames, getPlatformNames } from '@/utils/helpers/Games'
import Image from 'next/image'
import CheckoutButton from '@/components/Games/CheckoutButton'

type Props = {
  game: Game & {
    media: Media[]
    platforms: {
      platform: Platform
    }[]
    categories: {
      category: Category
    }[]
  }
}

export default function GameDetails({ game }: Props) {
  const releaseDate = new Date(game.releasedAt || '')
  const dateString = releaseDate.toLocaleDateString() || 'TBA'
  const categories = getCategoryNames(game.categories) || 'TBA'
  const platforms = getPlatformNames(game.platforms) || 'TBA'

  return (
    <>
      <div className=" p-8 py-10 w-90 bg-neutral-900 rounded-xl hidden lg:block">
        {game.coverImageUrl && (
          <Image
            src={game.coverImageUrl}
            height={200}
            width={300}
            alt={game.title}
            className=" mb-8"
          />
        )}
        <div className="flex flex-col gap-2 my-3 md:w-48 lg:w-72">
          <p className=" text-2xl font-medium mb">{game.title}</p>
          <p className=" text-neutral-300 text-md mb-3">$ {game.price}</p>
          {/* <Button className=" uppercase">Buy</Button> */}
          <CheckoutButton game={game} />

          <Separator className=" mb-5" />
          <DataCell title="Release Date">{dateString}</DataCell>
          {categories && <DataCell title="Categories">{categories}</DataCell>}
          {platforms && <DataCell title="Platfroms">{platforms}</DataCell>}
        </div>
      </div>

      {/* Mobile component */}
      <div className="fixed z-20 bottom-8 p-4 px-6 bg-neutral-900 border rounded-lg flex gap-4 items-center right-8 left-8 lg:hidden">
        {game.coverImageUrl && (
          <Image
            className=" rounded-sm"
            src={game.coverImageUrl}
            height={64}
            width={48}
            alt={game.title}
          />
        )}
        <div className="flex-grow">
          <p className=" text-lg font-medium mb">{game.title}</p>
          <p className=" text-neutral-500 text-md">$ {game.price}</p>
        </div>
        <Button className=" uppercase">Buy</Button>
      </div>
    </>
  )
}
