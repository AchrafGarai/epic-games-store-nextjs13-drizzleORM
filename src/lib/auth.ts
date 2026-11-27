import 'server-only'

import { auth } from '@clerk/nextjs/server'
import { cache } from 'react'
import { features } from '@/config/env'

/** The signed-in Clerk user id, or null when signed out or auth is off. */
export const getUserId = cache(async (): Promise<string | null> => {
  if (!features.auth) return null
  const { userId } = await auth()
  return userId
})
