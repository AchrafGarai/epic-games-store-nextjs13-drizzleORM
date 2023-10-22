import React, { ReactNode } from 'react'
import GameFilters from '@/components/Filters'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  params: { slug: string }

  children: ReactNode
}

function Layout({ children, params }: Props) {
  return (
    <div>
      <div className=" pb-4 justify-end flex md:hidden">
        <Sheet>
          <SheetTrigger
            className={cn('gap-2', buttonVariants({ variant: 'ghost' }))}
          >
            <MixerHorizontalIcon width={18} height={18} />
            Filters
          </SheetTrigger>
          <SheetContent className=" bg-neutral-900 p-2 pt-6">
            <SheetHeader></SheetHeader>
            <GameFilters />
          </SheetContent>
        </Sheet>
      </div>
      <div className=" flex gap-8">
        {children}
        <div className="hidden md:block">
          <GameFilters />
        </div>
      </div>
    </div>
  )
}

export default Layout
