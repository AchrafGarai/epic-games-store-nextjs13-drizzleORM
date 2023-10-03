import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useFilters() {
  const query = useSearchParams();
  const [filters, setFilters] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  useEffect(() => {
    const price = query.get("Price") || "5";
    const categories = query.get("categories") || "";
    const platforms = query.get("platfroms") || "";

    setFilters({
      price,
      categories,
      platforms,
    });
  }, []);

  return { filters, setFilters }; // Return both state and setter
}
