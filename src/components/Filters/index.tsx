import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import FilterControls from "./FillterControls";
import { useCategories } from "@/lib/categories";
import { usePlatfroms } from "@/lib/platfroms";

type SeachParams = { [key: string]: string | string[] | undefined };

async function GameFilters({ searchParams }: { searchParams?: SeachParams }) {
  const categories = await useCategories();
  const platforms = await usePlatfroms();
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
