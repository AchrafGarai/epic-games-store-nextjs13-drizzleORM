import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center rounded-lg p-2" aria-label="Store home">
      <Image src="/epic-games-logo-2.png" alt="" width={40} height={48} className="h-12 w-auto" />
    </Link>
  )
}
