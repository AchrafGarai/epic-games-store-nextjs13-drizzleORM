import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { features } from '@/config/env'
import { getUserId } from '@/lib/auth'
import { getStore } from '@/lib/store'

export async function UserArea() {
  const [userId, store] = await Promise.all([getUserId(), getStore()])

  return (
    <div className="flex items-center gap-3">
      {(store.kind === 'static' || !features.auth) && (
        <span
          className="hidden rounded-full bg-store-800 px-3 py-1 text-xs text-store-300 sm:inline"
          title={
            store.kind === 'static'
              ? 'No database is configured, so the catalog is served from static data and purchases are off.'
              : 'Clerk isn’t configured, so sign-in is off.'
          }
        >
          {store.kind === 'static' ? 'Demo · static catalog' : 'Demo · no sign-in'}
        </span>
      )}
      {features.auth &&
        (userId ? (
          <UserButton />
        ) : (
          <Link href="/sign-in" className={buttonVariants({ variant: 'secondary' })}>
            Sign in
          </Link>
        ))}
    </div>
  )
}
