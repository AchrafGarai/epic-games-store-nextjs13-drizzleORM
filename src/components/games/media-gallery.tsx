'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function MediaGallery({ slug, title, count }: { slug: string; title: string; count: number }) {
  const [index, setIndex] = useState(0)
  if (count === 0) return null
  const go = (delta: number) => setIndex((current) => (current + delta + count) % count)

  return (
    <section aria-label={`${title} screenshots`} className="flex flex-col gap-4">
      <div
        className="relative aspect-video overflow-hidden rounded-xl bg-store-800"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') go(-1)
          if (event.key === 'ArrowRight') go(1)
        }}
      >
        <Image
          src={`/media/${slug}/shot-${index + 1}`}
          alt={`${title} screenshot ${index + 1} of ${count}`}
          fill
          loading="eager"
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous screenshot"
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-black/80"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next screenshot"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/60 p-2 hover:bg-black/80"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="flex gap-3 overflow-x-auto pb-1">
          {Array.from({ length: count }, (_, i) => (
            <li key={i} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show screenshot ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={cn(
                  'block overflow-hidden rounded-lg opacity-60 ring-2 ring-transparent transition hover:opacity-100',
                  i === index && 'opacity-100 ring-white',
                )}
              >
                <Image src={`/media/${slug}/shot-${i + 1}`} alt="" width={160} height={90} className="h-[90px] w-40 object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
