import { UserButton } from "@clerk/nextjs";
import React from "react";
import { Input } from "../ui/input";

function Navbar() {
  return (
    <div className="flex justify-between items-center mb-8">
      <Input className=" max-w-xs" placeholder="Search the library " />
      <UserButton
        afterSignOutUrl="/"
        userProfileMode="navigation"
        userProfileUrl="/user-profile"
      />
    </div>
  );
}

export default Navbar;
