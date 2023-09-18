'use client'
import { redirect } from 'next/navigation'
import React from 'react'
import { useRouter } from 'next/navigation'

const CheckoutButton = () => {
  const router = useRouter()
  const openCheckout = async () => {
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    var raw = JSON.stringify({
      stripeId: 'price_1NrLdpKE7S4YJzLGRy5pQH3q',
    })

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    }

    const { checkoutUrl } = await fetch(
      '/api/checkout',
      requestOptions,
    ).then((response) => response.json())

    router.push(checkoutUrl)
  }
  return <button onClick={openCheckout}>CheckoutButton</button>
}

export default CheckoutButton
