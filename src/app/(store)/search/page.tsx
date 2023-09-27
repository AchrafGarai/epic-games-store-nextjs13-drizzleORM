import GamesGrid from "@/components/Games/GamesGrid";
import { Game } from "@/db/game/schema";
import React from "react";

type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

async function SearchPage({ params, searchParams }: Props) {
  const { data } = (await fetch("http://localhost:3000/api/game?limit=4")
    .then((res) => res.json())
    .catch((e) => console.log(e))) as {
    data: Game[];
  };
  return (
    <div>
      <GamesGrid games={data} />
    </div>
  );
}

export default SearchPage;
