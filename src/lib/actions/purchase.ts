'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { env, features } from '@/config/env'
import { getUserId } from '@/lib/auth'
import type { CheckoutMetadata } from '@/lib/payments'
import { getStore } from '@/lib/store'
import { getStripe } from '@/lib/stripe'

const slugSchema = z.string().regex(/^[a-z0-9-]{1,80}$/)

export type PurchaseResult = { error: string } | undefined

/**
 * Buys or claims a game. The price always comes from the database, never
 * from the client (the 2023 version trusted a Stripe price id sent by the
 * browser).
 */
export async function purchase(rawSlug: string): Promise<PurchaseResult> {
  const slug = slugSchema.parse(rawSlug)
  const store = await getStore()
  if (store.kind === 'static') {
    return { error: 'Purchases need a database. This deployment is a read-only demo.' }
  }

  const userId = await getUserId()
  if (!userId) {
    if (!features.auth) return { error: 'Sign-in isn’t configured on this deployment.' }
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/games/${slug}`)}`)
  }

  const game = await store.getGame(slug)
  if (!game) return { error: 'This game no longer exists.' }
  if ((await store.ownedSlugs(userId)).has(slug)) return { error: 'You already own this game.' }

  const stripe = getStripe()
  if (game.priceCents === 0 || !stripe) {
    // Free games are claimed directly. Without Stripe (local development),
    // paid games are granted too, so the flow can be tried end to end.
    await store.addToLibrary(userId, slug, game.priceCents === 0 ? 'free' : 'demo-no-payment')
    revalidatePath(`/games/${slug}`)
    revalidatePath('/library')
    return
  }

  const metadata: CheckoutMetadata = { userId, slug }
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: game.priceCents,
          product_data: { name: game.title, images: [`${env.siteUrl}/media/${slug}/cover`] },
        },
      },
    ],
    client_reference_id: userId,
    metadata,
    success_url: `${env.siteUrl}/games/${slug}?purchase=success`,
    cancel_url: `${env.siteUrl}/games/${slug}`,
  })
  if (!session.url) return { error: 'Couldn’t start checkout. Please try again.' }
  redirect(session.url)
}
