import GamesGrid from "@/components/Games/GamesGrid";
import { Category, Game } from "@/db/game/schema";
import React from "react";
import { constructURL } from "@/utils/pagination";
import { Platform } from "@/db/platforms/schema";
type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

async function SearchPage({ params, searchParams }: Props) {
  const filters = constructURL(searchParams);
  let { data } = (await fetch(
    `http://localhost:3000/api/game${filters}&limit=4`
  )
    .then((res) => res.json())
    .catch((e) => console.log(e))) as any;

  data[0] &&
    data[0].games &&
    (data = data.map((game: { games: Game }) => game.games));

  return (
    <div className="flex-grow">
      <GamesGrid games={data} variant={"reduced"} />
    </div>
  );
}

export default SearchPage;
