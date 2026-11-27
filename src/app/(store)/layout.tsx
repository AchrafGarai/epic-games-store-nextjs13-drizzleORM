import { Suspense } from 'react'
import { Logo } from '@/components/layout/logo'
import { MobileNav } from '@/components/layout/mobile-nav'
import { NavLinks } from '@/components/layout/nav-links'
import { SearchBox } from '@/components/layout/search-box'
import { UserArea } from '@/components/layout/user-area'

const REPO = 'https://github.com/AchrafGarai/epic-games-store-nextjs13-drizzleORM'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-8 bg-store-950 p-4 xl:flex">
        <Logo />
        <nav aria-label="Main">
          <NavLinks />
        </nav>
      </aside>
      <div className="mx-auto flex w-full max-w-[1440px] min-w-0 flex-col px-4 py-4 md:px-8 lg:px-12">
        <header className="mb-8 flex items-center gap-3">
          <MobileNav />
          <SearchBox />
          <div className="ml-auto">
            <Suspense>
              <UserArea />
            </Suspense>
          </div>
        </header>
        <main id="content" className="flex-1">
          {children}
        </main>
        <footer className="mt-16 border-t border-store-800 py-6 text-center text-sm text-store-500">
          A portfolio demo, not affiliated with Epic Games. Games and artwork are fictional.{' '}
          <a href={REPO} className="underline hover:text-white">
            Source on GitHub
          </a>
        </footer>
      </div>
    </div>
  )
}
