import React, { ReactNode } from "react";
import GameFilters from "@/components/Filters";

type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
  children: ReactNode;
};

function Layout({ children, params, searchParams }: Props) {
  return (
    <div className=" flex gap-4">
      {children}
      <GameFilters searchParams={searchParams} />
    </div>
  );
}

export default Layout;
