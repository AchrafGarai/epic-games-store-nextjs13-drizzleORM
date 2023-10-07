import GamesGrid from "@/components/Games/GamesGrid";
import { Category, Game, games } from "@/db/game/schema";
import React from "react";
import { constructURL } from "@/utils/pagination";
import { Platform } from "@/db/platforms/schema";
import { useGames } from "@/lib/games";
import Pagination from "@/components/Pagination";
import FeaturedGames from "@/components/FeaturedGames";
type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

async function SearchPage({ params, searchParams }: Props) {
  const filters = constructURL(searchParams);
  const page = Number(searchParams?.page) || 1;
  const featuredId = Number(searchParams?.featured) || undefined;

  type res = { games: Game };
  const { data, hasNextPage } = await useGames<any>(page, searchParams);
  let flattenedGames = data;
  if (data[0] && data[0].games) {
    flattenedGames = data.flatMap((obj) => obj.games);
  }

  return (
    <div className="flex-grow">
      {flattenedGames && (
        <GamesGrid games={flattenedGames} variant={"reduced"} />
      )}
      <Pagination hasNextPage={hasNextPage} page={page} />
    </div>
  );
}

export default SearchPage;
