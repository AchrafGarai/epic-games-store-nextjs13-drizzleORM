'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Game } from '@/db/game/schema'
import { useRouter } from 'next/navigation'

function CheckoutButton({ game, isOwned }: { game: Game; isOwned: boolean }) {
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
        gameId: game.id,
      })

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      }
      const { checkoutUrl } = await fetch(`/api/checkout`, requestOptions)
        .then((res) => res.json())
        .catch((e) => console.log(e))

      // TODO Redirect User to Checkout
      router.push(checkoutUrl)
      // Stop  Loading
    } catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }

  return (
    <>
      {isOwned ? (
        <>
          <Button disabled={true} className="gap mb-4">
            Game In Library
          </Button>
        </>
      ) : (
        <>
          <Button
            className="gap mb-4"
            onClick={hadnleCheckout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ReloadIcon
                  width={20}
                  height={20}
                  className="mr-2 h-4 w-4 animate-spin"
                />
                Loading...
              </>
            ) : (
              <>PURCHASE</>
            )}
          </Button>
        </>
      )}
    </>
  )
}

export default CheckoutButton
