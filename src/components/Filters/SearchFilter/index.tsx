"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";

type Props = {
  onSearchChange: (key: string, value: string) => void;
};

function SearchFilter() {
  const query = useSearchParams();
  const defaultSearch = query.get("q");
  return (
    <div className="flex gap-2 flex-col ">
      <span>Search</span>
      <Input
        value={defaultSearch ? defaultSearch : undefined}
        placeholder="Search the library"
        className=" bg-neutral-800 border-neutral-700 mb-4"
        // onChange={(e) => onSearchChange("q", e.target.value)}
      />
      <Separator />
    </div>
  );
}

export default SearchFilter;
