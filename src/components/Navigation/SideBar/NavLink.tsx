"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactElement, ReactNode } from "react";

type Props = {
  icon: ReactElement;
  label: string;
  slug: string;
};

function NavLink({ icon, label, slug }: Props) {
  const pathname = usePathname();
  return (
    <Link
      href={slug}
      className={`${
        pathname === slug
          ? " flex items-center gap-4 p-4 text-base font-medium text-neutral-100 bg-neutral-800 rounded-xl "
          : " flex items-center gap-4 p-4 text-base font-medium text-neutral-500 "
      }`}
    >
      {icon} {label}
    </Link>
  );
}

export default NavLink;
