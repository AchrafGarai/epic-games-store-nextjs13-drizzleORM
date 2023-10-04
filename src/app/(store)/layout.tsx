import { Navbar, SideBar } from "@/components/Navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative flex flex-row gap-4 bg-epic-500">
        <SideBar />
        <div className="p-16 py-8 flex-grow max-w-[1440px] mx-auto">
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;
