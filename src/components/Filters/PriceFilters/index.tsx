"use client";

import React from "react";
import { ToggleGroupRoot, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams } from "next/navigation";

type Props = {
  onPriceChange: (key: string, value: string) => void;
  searchParams?: { [key: string]: string | string[] | undefined };
};

function PriceFilters({ searchParams, onPriceChange }: Props) {
  const query = useSearchParams();
  const activeFilter = query.get("price") || "5";
  return (
    <AccordionItem value="Price">
      <AccordionTrigger>Price</AccordionTrigger>
      <AccordionContent className="flex gap-3">
        <ToggleGroupRoot
          type="single"
          aria-label="Price"
          variant={"inline"}
          defaultValue={activeFilter}
          onValueChange={(value) => onPriceChange("price", value)}
        >
          <ToggleGroupItem value="5" align={"left"}>
            5
          </ToggleGroupItem>
          <ToggleGroupItem value="25" align={"left"}>
            25
          </ToggleGroupItem>
          <ToggleGroupItem value="50" align={"left"}>
            50
          </ToggleGroupItem>
        </ToggleGroupRoot>
      </AccordionContent>
    </AccordionItem>
  );
}

export default PriceFilters;
