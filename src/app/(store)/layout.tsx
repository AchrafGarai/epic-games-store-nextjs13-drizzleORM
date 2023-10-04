import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative flex flex-row gap-4 bg-epic-500">
        <SideBar />
        <div className="p-16 py-8 flex-grow">
          <Navbar />
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;
