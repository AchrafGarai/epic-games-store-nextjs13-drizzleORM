'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Game } from '@/db/game/schema'
import { useRouter } from 'next/navigation'

function CheckoutButton({ game }: { game: Game }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const hadnleCheckout = async () => {
    try {
      // Start Loading
      setIsLoading(true)
      // Fetch Checkout URL
      var myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      var raw = JSON.stringify({
        stripeId: game.stripeId,
      })

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      }
      const { checkoutUrl } = await fetch(
        `http://localhost:3000/api/checkout`,
        requestOptions,
      )
        .then((res) => res.json())
        .catch((e) => console.log(e))

      // TODO Redirect User to Checkout
      console.log(checkoutUrl)
      router.push(checkoutUrl)
      // Stop  Loading
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Button className="uppercase" onClick={hadnleCheckout}>
      Buy
    </Button>
  )
}

export default CheckoutButton
