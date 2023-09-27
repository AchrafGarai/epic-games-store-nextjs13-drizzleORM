import { constructURL } from "@/utils/pagination";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  page: number;
  searchParams?: { [key: string]: string | string[] | undefined };
};

function Pagination({ page, searchParams }: Props) {
  const nextPage = constructURL(searchParams, {
    key: "page",
    value: `${page + 1}`,
  });
  const previousPage = constructURL(searchParams, {
    key: "page",
    value: `${page > 1 ? page - 1 : 1}`,
  });

  return (
    <div className="flex gap-2 my-16">
      <Link
        className={buttonVariants({ variant: "secondary" })}
        href={previousPage}
      >
        Previous
      </Link>
      <Link
        className={buttonVariants({ variant: "secondary" })}
        href={nextPage}
      >
        Next
      </Link>
    </div>
  );
}

export default Pagination;
