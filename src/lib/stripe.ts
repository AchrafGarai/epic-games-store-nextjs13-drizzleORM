import 'server-only'

import Stripe from 'stripe'
import { env } from '@/config/env'

let client: Stripe | null = null

/** The Stripe client, or null when STRIPE_SECRET_KEY isn't set. */
export function getStripe() {
  if (!env.stripeSecretKey) return null
  client ??= new Stripe(env.stripeSecretKey)
  return client
}
