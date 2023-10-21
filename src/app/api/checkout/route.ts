import { stripe } from "@/utils/stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { z } from "zod";

// Validate request
const CheckoutSchema = z.object({
  stripeId: z.string(),
  gameId: z.number(),
});

export async function POST(request: Request, response: Response) {
  const req = (await request.json()) as z.infer<typeof CheckoutSchema>;
  const { stripeId, gameId } = req;
  const { userId } = auth();

  // Validate request
  const r = CheckoutSchema.safeParse(req);
  if (!r.success) {
    const { errors } = r.error;
    return NextResponse.json(errors, { status: 400 });
  }

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
      mode: "payment",
      success_url: `http://localhost:3000/games/${gameId}`,
      cancel_url: `http://localhost:3000/games/${gameId}`,
    });
    if (url) {
      return NextResponse.json({ checkoutUrl: url });
    } else {
      return NextResponse.json({ error: "unable to create the checkout" });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "unable to create the checkout" });
  }
}

// export const revalidate = 1
