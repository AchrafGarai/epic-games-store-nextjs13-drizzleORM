"use client";
import { Category } from "@/db/game/schema";
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Platform } from "@/db/platforms/schema";
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  categories: Category[] | Platform[];
  title: string;
  onFilterChange: (key: string, value: string) => void;
};

function CategoryFilters({ categories, title, onFilterChange }: Props) {
  const query = useSearchParams();
  let activeFilters: string[] = (
    query.get(title.toLocaleLowerCase()) ?? ""
  ).split("|");
  activeFilters = (query.get(title.toLocaleLowerCase()) ?? "").split("|");

  const handleFilterChange = (
    filtername: string,
    categoryName: string,
    status: boolean,
    activeFilter: string[]
  ) => {
    status
      ? activeFilters.includes(categoryName) || activeFilters.push(categoryName)
      : activeFilters.splice(activeFilters.indexOf(categoryName), 1);

    onFilterChange(
      title.toLocaleLowerCase(),
      activeFilter.filter(Boolean).join("|")
    );
  };
  return (
    <>
      <AccordionItem value={title}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          {categories.map((category) => (
            <Toggle
              defaultPressed={
                activeFilters?.includes(category.name) ? true : false
              }
              key={category.name}
              aria-label="Toggle italic"
              className="w-full  mb-2 justify-between"
              onPressedChange={(status: boolean) => {
                handleFilterChange(
                  title.toLocaleLowerCase(),
                  category.name,
                  status,
                  activeFilters
                );
              }}
            >
              {category.name}
            </Toggle>
          ))}
        </AccordionContent>
      </AccordionItem>
    </>
  );
}

export default CategoryFilters;
