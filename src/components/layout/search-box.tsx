import { Search } from 'lucide-react'

/** A plain GET form: works before JavaScript loads and keeps URLs shareable. */
export function SearchBox({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/search" role="search" className="relative w-full max-w-xs">
      <Search size={16} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-store-500" aria-hidden="true" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search store"
        aria-label="Search store"
        className="h-11 w-full rounded-full bg-store-800 pr-4 pl-11 text-sm placeholder:text-store-500 focus:bg-store-700 focus:outline-none"
      />
    </form>
  )
}
