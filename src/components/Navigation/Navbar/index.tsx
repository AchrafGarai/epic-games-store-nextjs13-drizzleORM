import { UserButton } from "@clerk/nextjs";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchBar } from "..";
import { buttonVariants } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { SideBar } from "..";

function Navbar() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex gap-4">
        {/* Mobile Navigation trigger */}
        <div className="block xl:hidden">
          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "ghost" })}>
              <HamburgerMenuIcon width={24} height={24} />
            </SheetTrigger>
            <SheetContent side={"left"} className=" bg-epic-500">
              <SheetHeader></SheetHeader>
              <SideBar />
            </SheetContent>
          </Sheet>
        </div>
        {/* Mobile Navigation trigger */}

        <SearchBar basePath="search" />
      </div>
      <UserButton
        afterSignOutUrl="/"
        userProfileMode="navigation"
        userProfileUrl="/user-profile"
      />
    </div>
  );
}

export default Navbar;
