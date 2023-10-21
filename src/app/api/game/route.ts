import { db } from '@/db'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { categories, games, gamesToCategories } from '@/db/game/schema'
import { media } from '@/db/media/schema'
import { stripe } from '@/utils/stripe'
import { createGameSchema } from './schema'
import { and, eq, ilike, inArray, lte } from 'drizzle-orm'
import { platforms } from '@/db/platforms/schema'

export async function GET(request: Request) {
  // Load queries from URL
  const { searchParams } = new URL(request.url)
  const param = searchParams.get('q')
  const paramCategories = searchParams.get('categories')?.split('|')
  const paramPlatforms = searchParams.get('platforms')?.split('|') || null
  const maximumPrice = searchParams.get('price') || null

  const limit = Number(searchParams.get('limit'))
  const offset = Number(searchParams.get('offset'))

  // Create search conditions
  const searchCondition = param ? ilike(games.title, `%${param}%`) : undefined

  const categoriesConditions = paramCategories
    ? inArray(categories.name, paramCategories)
    : undefined

  const platformsConditions = paramPlatforms
    ? inArray(platforms.name, paramPlatforms)
    : undefined

  const priceConsition = maximumPrice
    ? lte(games.price, maximumPrice)
    : undefined

  const conditions = [
    searchCondition,
    platformsConditions,
    categoriesConditions,
    priceConsition,
  ].filter((arg) => arg !== undefined)

  const query = db.select().from(games)

  if (paramCategories) {
    query.innerJoin(categories, eq(games.id, categories.id))
  }

  if (paramPlatforms) {
    query.innerJoin(platforms, eq(games.id, platforms.id))
  }
  query
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)

  const data = await query

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const req = (await request.json()) as z.infer<typeof createGameSchema>
  const r = createGameSchema.safeParse(req)
  if (!r.success) {
    const { errors } = r.error
    return NextResponse.json(errors, { status: 400 })
  }
  const {
    title,
    screenshots,
    releaseDate,
    price,
    coverImageUrl,
    bannerImageUrl,
    gameDescription,
  } = req
  const result = await db
    .insert(games)
    .values({
      title,
      releasedAt: new Date(releaseDate),
      price,
      coverImageUrl,
      bannerImageUrl,
      gameDescription,
    })
    .returning({ gameId: games.id, title: games.title })

  // Create an Image
  const gameBanner = coverImageUrl ? coverImageUrl : ''

  // Create the stripe product
  const { default_price } = (await stripe.products.create({
    name: title,
    images: [gameBanner],
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

// export const revalidate = 1; // revalidate at most every hour
