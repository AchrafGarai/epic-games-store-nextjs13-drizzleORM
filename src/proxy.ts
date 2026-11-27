import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'

const authEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
)
const clerk = clerkMiddleware()

/**
 * Runs Clerk only when it is configured. Without keys the store still works
 * as a guest-only catalog instead of failing every request.
 */
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  return authEnabled ? clerk(request, event) : NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next internals, generated artwork and static files.
    '/((?!_next|media|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
