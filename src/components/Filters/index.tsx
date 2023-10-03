import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/db/game/schema";
import CategoryFilters from "./CategoryFilter";
import Link from "next/link";
import PriceFilters from "./PriceFilters";
import { Platform } from "@/db/platforms/schema";
import FilterControls from "./FillterControls";

type SeachParams = { [key: string]: string | string[] | undefined };

async function GameFilters({ searchParams }: { searchParams?: SeachParams }) {
  const categories = (await fetch("http://localhost:3000/api/categories")
    .then((res) => res.json())
    .catch((e) => console.log(e))) as {
    data: Category[];
  };
  const platforms = (await fetch("http://localhost:3000/api/platfroms")
    .then((res) => res.json())
    .catch((e) => console.log(e))) as {
    data: Platform[];
  };
  return (
    <>
      <div className="h-full">
        <div className=" bg-neutral-900 w-80 rounded-xl pb-8 sticky top-4 min-h-screen">
          <div className="flex gap-3 items-center justify-between px-8 py-6">
            <p className=" font-semibold ">Filters</p>
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={"/search"}
            >
              Reset
            </Link>
          </div>
          <Separator />
          <div className="px-8 py-6">
            <FilterControls categories={categories} platforms={platforms} />
          </div>
        </div>
      </div>
    </>
  );
}

export default GameFilters;
