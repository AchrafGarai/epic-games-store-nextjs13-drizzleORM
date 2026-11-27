import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { Suspense } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { features } from '@/config/env'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {features.auth ? (
        // Clerk's form reads the URL on the client, so it streams in after the shell.
        <Suspense fallback={<div className="h-[480px] w-[400px] animate-pulse rounded-2xl bg-store-800" />}>
          <SignIn />
        </Suspense>
      ) : (
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">Sign-in isn’t configured</h1>
          <p className="text-store-300">
            Add Clerk keys to enable accounts. Until then you can browse the full catalog as a guest.
          </p>
          <Link href="/" className={buttonVariants()}>
            Back to the store
          </Link>
        </div>
      )}
    </div>
  )
}
