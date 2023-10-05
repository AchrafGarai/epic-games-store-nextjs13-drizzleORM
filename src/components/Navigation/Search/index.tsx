"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type Props = {
  className?: string;
  // onSearchChange?: (key: string, value: string) => void;
  defaultValue?: string;
};

function SearchBar({ className, defaultValue }: Props) {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string>("");
  const [query] = useDebounce(searchValue, 300);

  useEffect(() => {
    !query ? router.push("/search") : router.push(`/search?q=${searchValue}`);
  }, [query, router]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };
  return (
    <>
      <div className="relative">
        <Input
          defaultValue={defaultValue}
          className={cn("max-w-xs pr-10", className)}
          placeholder="Search the library"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <MagnifyingGlassIcon
          className="absolute right-3 top-3"
          width={16}
          height={16}
        />
      </div>
    </>
  );
}

export default SearchBar;
