import React, { ReactNode } from "react";
import GameFilters from "@/components/Filters";

type Props = {
  params: { slug: string };
  children: ReactNode;
};

function Layout({ children }: Props) {
  return <>{children}</>;
}

export default Layout;
