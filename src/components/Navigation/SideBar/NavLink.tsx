"use client";
import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactElement, ReactNode } from "react";

const navLinkVariants = cva(
  "flex items-center gap-4 p-4 text-base font-medium text-neutral-100",
  {
    variants: {
      variant: {
        default: "text-neutral-500",
        selected: "bg-neutral-800 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type NavLinkProps = VariantProps<typeof navLinkVariants>;

interface Props extends NavLinkProps {
  className?: string;
  icon: ReactElement;
  label: string;
  slug: string;
}

function NavLink({ icon, label, slug }: Props) {
  const pathname = usePathname();
  return (
    <Link
      href={slug}
      className={navLinkVariants({
        variant: pathname === slug ? "selected" : "default",
      })}
    >
      {icon} {label}
    </Link>
  );
}

export default NavLink;
