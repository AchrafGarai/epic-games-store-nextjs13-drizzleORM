import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { SearchBar } from '..'
import MobileNav from '../SideBar/MobileNav'

function Navbar() {
  return (
    <div className="flex justify-between items-center mb-8 gap-4">
      <div className="flex gap-4">
        {/* Mobile Navigation trigger */}
        <MobileNav />
        {/* Mobile Navigation trigger */}

        <SearchBar basePath="search" />
      </div>
      <UserButton
        afterSignOutUrl="/"
        userProfileMode="navigation"
        userProfileUrl="/user-profile"
      />
    </div>
  )
}

export default Navbar
