'use client'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'
import { buttonVariants } from '@/components/ui/button'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import SideBar from '..'
import { usePathname } from 'next/navigation'

function MobileNav() {
  const pathName = usePathname()
  return (
    <div className="block xl:hidden" key={pathName}>
      <Sheet>
        <SheetTrigger className={buttonVariants({ variant: 'ghost' })}>
          <HamburgerMenuIcon width={24} height={24} />
        </SheetTrigger>
        <SheetContent side={'left'} className=" bg-epic-500">
          <SheetHeader></SheetHeader>
          <SideBar />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
