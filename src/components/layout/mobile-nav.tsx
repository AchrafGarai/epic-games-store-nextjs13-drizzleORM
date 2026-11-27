'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Logo } from './logo'
import { NavLinks } from './nav-links'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="rounded-lg p-2 hover:bg-store-800 xl:hidden" aria-label="Open menu">
        <Menu />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col gap-6 bg-store-950 p-4">
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <div className="flex items-center justify-between">
            <Logo />
            <Dialog.Close className="rounded-lg p-2 hover:bg-store-800" aria-label="Close menu">
              <X />
            </Dialog.Close>
          </div>
          <NavLinks onNavigate={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
