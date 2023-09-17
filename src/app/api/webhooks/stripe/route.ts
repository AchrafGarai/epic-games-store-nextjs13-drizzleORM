import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { games, libraryItems } from '@/db/game/schema'
import { users } from '@/db/user/schema'

// Stripe will give you a webhook secret when setting up webhooks.
// well get this later and add it to the .env.local file when testing
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const payload = await req.text()
  const signature = req.headers.get('stripe-signature')

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature!,
      webhookSecret,
    )
    switch (event.type) {
      case 'checkout.session.completed':
        // handle payment_intent.succeded
        if (event.type === 'checkout.session.completed') {
          try {
            const { client_reference_id } = event.data.object as any
            console.log(event.data.object)
            const { stripeId, authId } = JSON.parse(client_reference_id)
            console.log(stripeId, authId)

            if (stripeId && authId) {
              const game = await db.query.games.findFirst({
                where: eq(games.stripeId, stripeId),
                columns: {
                  id: true,
                },
              })
              const user = await db.query.users.findFirst({
                where: eq(users.authId, authId),
                columns: {
                  id: true,
                },
              })

              const result = await db.insert(libraryItems).values({
                gameId: game?.id,
                userId: user?.id,
              })
              return NextResponse.json({ message: 'Registered successfully ' })
            }
          } catch (e) {
            console.log(e)
          }
        }

        break
      default:
        // other events that we don't handle
        break
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message)
      return NextResponse.json({ message: err.message }, { status: 400 })
    }
  }
  return NextResponse.json({ received: true })
}
