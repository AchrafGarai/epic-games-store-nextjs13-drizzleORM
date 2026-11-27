import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link href="/" className={buttonVariants()}>
        Back to the store
      </Link>
    </div>
  )
}
