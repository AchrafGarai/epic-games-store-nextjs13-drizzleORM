import type Stripe from 'stripe'
import { env } from '@/config/env'
import { fulfillCheckout } from '@/lib/payments'
import { getStore } from '@/lib/store'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe || !env.stripeWebhookSecret) {
    return Response.json({ error: 'Payments are not configured' }, { status: 501 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return Response.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, env.stripeWebhookSecret)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const result = await fulfillCheckout(await getStore(), event.data.object)
    if (!result.granted) console.warn(`Checkout ${event.data.object.id} not fulfilled: ${result.reason}`)
  }

  return Response.json({ received: true })
}
