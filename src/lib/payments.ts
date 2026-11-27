import type Stripe from 'stripe'
import type { Store } from './store/types'

export type CheckoutMetadata = { userId: string; slug: string }

/**
 * Grants the purchased game once Stripe confirms payment. Called by the
 * webhook; safe to run more than once for the same session.
 */
export async function fulfillCheckout(store: Store, session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid') return { granted: false as const, reason: 'unpaid' }

  const { userId, slug } = (session.metadata ?? {}) as Partial<CheckoutMetadata>
  if (!userId || !slug) return { granted: false as const, reason: 'missing-metadata' }

  const game = await store.getGame(slug)
  if (!game) return { granted: false as const, reason: 'unknown-game' }
  if (session.amount_total !== game.priceCents) {
    return { granted: false as const, reason: 'amount-mismatch' }
  }

  const added = await store.addToLibrary(userId, slug, session.id)
  return { granted: true as const, duplicate: !added }
}
