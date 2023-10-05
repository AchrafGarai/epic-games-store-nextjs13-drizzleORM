"use client";
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { Category } from "@/db/game/schema";
import CategoryFilters from "@/components/Filters/CategoryFilter";
import PriceFilters from "@/components/Filters/PriceFilters";
import { Platform } from "@/db/platforms/schema";
import { useRouter, useSearchParams } from "next/navigation";
import { createQueryString } from "@/utils/filters";
import { SearchBar } from "@/components/Navigation";

type Props = {
  categories: {
    data: Category[];
  };
  platforms: {
    data: Platform[];
  };
};

function FilterControls({ categories, platforms }: Props) {
  const q = useSearchParams();
  const searchDefaultValue = q.get("q") || "";

  const router = useRouter();
  let filters: { [key: string]: string | undefined } = {};

  const handleFilterUpdate = (key: string, value: string) => {
    filters[key] = value;
    const query = createQueryString(filters);
    router.replace(`/search${query}`);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <CategoryFilters
        categories={categories.data}
        title="Categories"
        onFilterChange={(key, value) => handleFilterUpdate(key, value)}
      />
      <CategoryFilters
        categories={platforms.data}
        title="Platforms"
        onFilterChange={(key, value) => handleFilterUpdate(key, value)}
      />
      <PriceFilters
        onPriceChange={(price, value) => handleFilterUpdate(price, value)}
      />
    </Accordion>
  );
}

export default FilterControls;
