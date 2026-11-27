import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Pagination({
  page,
  hasNextPage,
  href,
}: {
  page: number
  hasNextPage: boolean
  href: (page: number) => string
}) {
  if (page === 1 && !hasNextPage) return null
  const link = (target: number, label: string, icon: React.ReactNode, enabled: boolean) =>
    enabled ? (
      <Link href={href(target)} className={buttonVariants({ variant: 'secondary' })} aria-label={label}>
        {icon}
      </Link>
    ) : (
      <span className={cn(buttonVariants({ variant: 'secondary' }), 'opacity-40')} aria-hidden="true">
        {icon}
      </span>
    )

  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
      {link(page - 1, 'Previous page', <ChevronLeft size={18} />, page > 1)}
      <span className="text-sm text-store-300">Page {page}</span>
      {link(page + 1, 'Next page', <ChevronRight size={18} />, hasNextPage)}
    </nav>
  )
}
