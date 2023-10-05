import { UserButton } from "@clerk/nextjs";
import React from "react";

import { SearchBar } from "..";

function Navbar() {
  return (
    <div className="flex justify-between items-center mb-8">
      {/* <Input className=" max-w-xs" placeholder="Search the library " /> */}
      <SearchBar />
      <UserButton
        afterSignOutUrl="/"
        userProfileMode="navigation"
        userProfileUrl="/user-profile"
      />
    </div>
  );
}

export default Navbar;
