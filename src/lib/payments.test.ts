import { migrate } from 'drizzle-orm/libsql/migrator'
import type Stripe from 'stripe'
import { beforeEach, describe, expect, it } from 'vitest'
import { createDb } from '@/db/client'
import { seedCatalog } from '@/db/seed-data'
import { fulfillCheckout } from './payments'
import { createDbStore } from './store/db-store'
import type { Store } from './store/types'

const session = (overrides: Partial<Stripe.Checkout.Session> = {}) =>
  ({
    id: 'cs_test_123',
    payment_status: 'paid',
    amount_total: 2499,
    metadata: { userId: 'user_1', slug: 'tidebound' },
    ...overrides,
  }) as Stripe.Checkout.Session

describe('fulfillCheckout', () => {
  let store: Store
  beforeEach(async () => {
    const db = createDb(':memory:')
    await migrate(db, { migrationsFolder: 'drizzle' })
    await seedCatalog(db)
    store = createDbStore(db)
  })

  it('adds the game to the buyer’s library', async () => {
    expect(await fulfillCheckout(store, session())).toEqual({ granted: true, duplicate: false })
    expect(await store.ownedSlugs('user_1')).toEqual(new Set(['tidebound']))
  })

  it('is idempotent when Stripe retries the webhook', async () => {
    await fulfillCheckout(store, session())
    expect(await fulfillCheckout(store, session())).toEqual({ granted: true, duplicate: true })
  })

  it('ignores unpaid sessions and bad metadata', async () => {
    expect((await fulfillCheckout(store, session({ payment_status: 'unpaid' }))).granted).toBe(false)
    expect((await fulfillCheckout(store, session({ metadata: {} }))).granted).toBe(false)
    expect(
      (await fulfillCheckout(store, session({ metadata: { userId: 'u', slug: 'nope' } }))).granted,
    ).toBe(false)
  })

  it('refuses a session whose amount does not match the game price', async () => {
    expect(await fulfillCheckout(store, session({ amount_total: 1 }))).toEqual({
      granted: false,
      reason: 'amount-mismatch',
    })
    expect(await store.ownedSlugs('user_1')).toEqual(new Set())
  })
})
