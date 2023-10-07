import { GamesGrid } from "@/components/Games";
import { Game } from "@/db/game/schema";
import React, { cache } from "react";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import { useGames } from "@/lib/games";
import Pagination from "@/components/Pagination";

type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

async function Library({ params, searchParams }: Props) {
  const page = Number(searchParams?.page) || 1;

  const { data, hasNextPage } = await useGames(page, searchParams, "library");

  return (
    <>
      <div className="flex-grow pt-4">
        <h1 className=" mb-8 text-4xl font-medium">Library</h1>
        <GamesGrid games={data} variant={"reduced"} />
        <Pagination page={page} hasNextPage={hasNextPage} />
      </div>
    </>
  );
}

export default Library;
