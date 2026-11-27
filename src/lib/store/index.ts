import 'server-only'

import { sql } from 'drizzle-orm'
import { connection } from 'next/server'
import { cache } from 'react'
import { env } from '@/config/env'
import { createDb } from '@/db/client'
import { createDbStore } from './db-store'
import { createStaticStore } from './static-store'
import type { Store } from './types'

export type { GameDetails, GameQuery, GameSummary, Page, Store } from './types'

const staticStore = createStaticStore()
const RECHECK_MS = 30_000

let databaseStore: Store | null = null
let lastCheck: { at: number; ok: boolean } | null = null

/**
 * The database store when `DATABASE_URL` is set and answering, otherwise the
 * read-only static store. A failed check is cached for 30 seconds, so an
 * unreachable database costs one attempt rather than one per request.
 */
export const getStore = cache(async (): Promise<Store> => {
  if (!env.databaseUrl) return staticStore

  await connection()
  const now = performance.now()
  if (lastCheck && now - lastCheck.at < RECHECK_MS) {
    return lastCheck.ok && databaseStore ? databaseStore : staticStore
  }

  try {
    const db = createDb(env.databaseUrl, env.databaseAuthToken)
    await db.run(sql`select count(*) from games`)
    databaseStore ??= createDbStore(db)
    lastCheck = { at: now, ok: true }
    return databaseStore
  } catch (error) {
    console.warn('Database unavailable, serving the static catalog:', (error as Error).message)
    lastCheck = { at: now, ok: false }
    return staticStore
  }
})
