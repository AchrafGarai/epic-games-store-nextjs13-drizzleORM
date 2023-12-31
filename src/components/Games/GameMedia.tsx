import { Media } from '@/db/media/schema'
import React from 'react'
import Image from 'next/image'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import Link from 'next/link'
import GameMediaThumbnail from './GameMediaThumbnail'
import GameMediaNavigation from './GameMediaNavigation'
import { CaretLeftIcon, CaretRightIcon } from '@radix-ui/react-icons'

type Props = {
  media: Media[]
  activeMedia?: number
  gameId: string
}
enum Direction {
  Left = 'left',
  Right = 'right',
}

function getNextIndex(
  currentIndex: number,
  direction: Direction,
  arrayLength: number,
): number {
  if (direction === Direction.Left) {
    return currentIndex === 0 ? arrayLength - 1 : currentIndex - 1
  } else if (direction === Direction.Right) {
    return currentIndex === arrayLength - 1 ? 0 : currentIndex + 1
  }
  return currentIndex // Return the same index if direction is neither left nor right
}

function GameMedia({ media, activeMedia, gameId }: Props) {
  const currentScreenShot = activeMedia ? media[activeMedia] : media[0]
  const currentIndex = Number(activeMedia) || 0
  const mediaLength = media.length
  const nextindex = getNextIndex(currentIndex, Direction.Left, mediaLength)
  const previousIndex = getNextIndex(currentIndex, Direction.Right, mediaLength)

  return (
    <>
      {currentScreenShot && (
        <div className="relative">
          <Image
            src={currentScreenShot.mediaUrl}
            width={1200}
            height={675}
            alt=""
          />
          {media.length > 1 && (
            <>
              <Link scroll={false} href={`/games/${gameId}?image=${nextindex}`}>
                <GameMediaNavigation>
                  <CaretLeftIcon width={24} height={24} />
                </GameMediaNavigation>
              </Link>
              <Link
                scroll={false}
                href={`/games/${gameId}?image=${previousIndex}`}
              >
                <GameMediaNavigation variant={'right'}>
                  <CaretRightIcon width={24} height={24} />
                </GameMediaNavigation>
              </Link>
            </>
          )}
        </div>
      )}
      {media.length > 1 && (
        <>
          <h4 className=" text-lg mb-4 font-medium mt-12 ">Screenshots</h4>

          <div className="flex p-4 gap-4 overflow-clip w-full flex-wrap">
            {media.map((media, index) => (
              <GameMediaThumbnail
                key={gameId}
                activeMedia={activeMedia}
                index={index}
                gameId={gameId}
                media={media}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default GameMedia
