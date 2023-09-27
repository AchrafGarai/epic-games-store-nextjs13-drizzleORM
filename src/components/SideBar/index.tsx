import React from "react";
import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  DashboardIcon,
} from "@radix-ui/react-icons";

const home = <HomeIcon width={24} height={24} />;
const magnifyingGlass = <MagnifyingGlassIcon width={24} height={24} />;
const library = <DashboardIcon width={24} height={24} />;
const links = [
  {
    label: "Home",
    slug: "/",
    svg: <HomeIcon width={24} height={24} />,
  },
  {
    label: "Explore",
    slug: "/search",
    svg: <MagnifyingGlassIcon width={24} height={24} />,
  },
  {
    label: "Library",
    slug: "/library",
    svg: <DashboardIcon width={24} height={24} />,
  },
];
function SideBar() {
  return (
    <div className="flex flex-col w-[260px] min-h-screen bg-epic-600 p-4">
      <div className="p-4 flex items-center justify-center">
        <Link href={"/"}>
          <Image
            src={"epic-games-logo.svg"}
            alt="epic games logo"
            width={45}
            height={54}
          />
        </Link>
      </div>
      <div className="flex flex-col mt-6 flex-grow">
        {links.map((link) => (
          <NavLink
            label={link.label}
            icon={link.svg}
            slug={link.slug}
            key={link.slug}
          />
        ))}
      </div>
      <div className="flex gap-4 items-center text-xs text-neutral-500">
        Code available on Github
      </div>
    </div>
  );
}

export default SideBar;
