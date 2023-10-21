import { GamesGrid } from "@/components/Games";
import React, { cache } from "react";
import { useGames } from "@/lib/games";
import Pagination from "@/components/Pagination";

type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

async function Library({ searchParams }: Props) {
  const page = Number(searchParams?.page) || 1;

  const { data, hasNextPage } = await useGames(
    page,
    searchParams,
    "my-library"
  );

  return (
    <>
      <div className="flex-grow pt-4">
        <h1 className=" mb-8 text-4xl font-medium">Library</h1>
        <GamesGrid games={data} />
        <Pagination page={page} hasNextPage={hasNextPage} />
      </div>
    </>
  );
}

export default Library;
