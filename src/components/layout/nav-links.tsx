'use client'

import { Compass, House, Library } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Store', icon: House },
  { href: '/search', label: 'Browse', icon: Compass },
  { href: '/library', label: 'Library', icon: Library },
]

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <ul className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-4 rounded-xl px-4 py-3 font-medium text-store-500 transition-colors hover:text-white',
                active && 'bg-store-800 text-white',
              )}
            >
              <Icon size={20} aria-hidden="true" /> {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
