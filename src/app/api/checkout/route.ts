import { stripe } from '@/utils/stripe'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request, response: Response) {
  const req = await request.json()
  const { stripeId } = req
  const { userId } = auth()
  try {
    // Create Checkout Sessions from body params.
    const { url } = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: stripeId,
          quantity: 1,
        },
      ],
      client_reference_id: JSON.stringify({
        authId: userId,
        stripeId,
      }),
      mode: 'payment',
      success_url: `https://www.google.com/?success=true`,
      cancel_url: `https://www.google.com/?canceled=true`,
    })
    if (url) return NextResponse.json({ checkoutUrl: url })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'unable to create the checkout' })
  }

  // // return NextResponse.json({ stripeId })
  // redirect('https://www.google.com')
}

export const revalidate = 1
