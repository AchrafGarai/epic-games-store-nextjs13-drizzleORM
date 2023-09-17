import { db } from '@/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { games } from '@/db/game/schema'
import { media } from '@/db/media/schema'
import { stripe } from '@/utils/stripe'
import { createGameSchema } from './schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const data = await db.query.games.findMany({
    with: {
      categories: {
        columns: {},
        with: {
          category: {
            columns: {
              name: true,
            },
          },
        },
      },
      platforms: {
        columns: {},
        with: {
          platform: {
            columns: {
              name: true,
            },
          },
        },
      },
      media: {
        columns: {
          mediaType: true,
          mediaUrl: true,
        },
      },
    },
  })
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const req = (await request.json()) as z.infer<typeof createGameSchema>
  const r = createGameSchema.safeParse(req)
  if (!r.success) {
    const { errors } = r.error
    return NextResponse.json(errors, { status: 400 })
  }
  const { title, screenshots, releaseDate, price, coverImageUrl } = req
  const result = await db
    .insert(games)
    .values({
      title,
      releasedAt: new Date(releaseDate),
      price,
      coverImageUrl,
    })
    .returning({ gameId: games.id, title: games.title })

  // Create the stripe product
  const { default_price } = (await stripe.products.create({
    name: title,
    default_price_data: {
      currency: 'usd',
      unit_amount: Number(price) * 100,
    },
  })) as { default_price: string }

  // Update stripe ID
  await db
    .update(games)
    .set({
      stripeId: default_price,
    })
    .where(eq(games.id, result[0].gameId))

  // insert media to games
  const transformedScreenshots = screenshots.map((obj) => ({
    ...obj, // Copy the existing properties
    gameId: result[0].gameId, // Add the new property
  }))
  const imgResult = await db
    .insert(media)
    .values(transformedScreenshots)
    .returning({ url: media.mediaUrl })
  return NextResponse.json({ result, imgResult, default_price })
}

export const revalidate = 1
