"use client";
import { SearchBar } from "@/components/Navigation";
import { Accordion } from "@/components/ui/accordion";
import { Category } from "@/db/game/schema";
import { Platform } from "@/db/platforms/schema";
import React from "react";
import LibraryFilter from "../LibraryFilter";
import { usePathname, useRouter } from "next/navigation";
import { createQueryString } from "@/utils/filters";

type Props = {
  categories: Category[];
  platforms: Platform[];
};

function LibraryFilterControls({ categories, platforms }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const currentPath = pathName.split("/").pop();
  let filters: { [key: string]: string | undefined } = {};

  const handleFilterUpdate = (key: string, value: string) => {
    filters[key] = value;
    const query = createQueryString(filters);
    router.replace(`/${currentPath}${query}`);
  };
  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {/* <div className="flex gap-2 flex-col">
          <span>Search Library</span>
          <SearchBar
            basePath="library"
            className=" bg-neutral-800 border-neutral-700 mb-4"
          />
        </div> */}
        <LibraryFilter
          title="Categories"
          categories={categories}
          onFilterChange={(key, value) => handleFilterUpdate(key, value)}
        />
        <LibraryFilter
          title="Platfroms"
          categories={platforms}
          onFilterChange={(key, value) => handleFilterUpdate(key, value)}
        />
      </Accordion>
    </>
  );
}

export default LibraryFilterControls;
