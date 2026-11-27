'use client'

import { Check, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { purchase } from '@/lib/actions/purchase'
import { formatPrice } from '@/lib/utils'

export function PurchaseButton({
  slug,
  priceCents,
  owned,
  mode,
}: {
  slug: string
  priceCents: number
  owned: boolean
  /** "checkout": Stripe; "direct": granted without payment; "disabled": read-only demo. */
  mode: 'checkout' | 'direct' | 'disabled'
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (owned) {
    return (
      <Button variant="secondary" size="lg" disabled className="w-full">
        <Check size={18} /> In library
      </Button>
    )
  }

  const label =
    priceCents === 0 ? 'Get' : mode === 'direct' ? `Get for ${formatPrice(priceCents)} (demo)` : `Buy now`

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="lg"
        className="w-full"
        disabled={pending || mode === 'disabled'}
        aria-busy={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null)
            const result = await purchase(slug)
            if (result?.error) setError(result.error)
          })
        }
      >
        {pending && <Loader2 size={18} className="animate-spin" />}
        {label}
      </Button>
      {mode === 'disabled' && (
        <p className="text-xs text-store-500">Purchases are off in this read-only demo.</p>
      )}
      {mode === 'direct' && priceCents > 0 && (
        <p className="text-xs text-store-500">Stripe isn’t configured, so this adds the game without payment.</p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
