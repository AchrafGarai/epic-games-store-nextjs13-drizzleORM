"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type Props = {
  className?: string;
  onSearchChange?: (key: string, value: string) => void;
  defaultValue?: string;
  basePath?: string;
};

function SearchBar({ className, basePath, onSearchChange }: Props) {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [query] = useDebounce(searchValue, 300);
  const pathName = usePathname();
  const q = useSearchParams();

  const currentPath = basePath ? basePath : pathName.split("/").pop();
  const defaultValue = q.get("q") || "";

  useEffect(() => {
    if (query) {
      router.push(`/${currentPath}?q=${searchValue}`);
    } else if (!query && searchValue === "") {
      router.push(`/${currentPath}`);
    }
  }, [query, router, currentPath, searchValue]);

  const handleSearch = (value: string) => {
    onSearchChange ? onSearchChange("q", value) : setSearchValue(value);
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
