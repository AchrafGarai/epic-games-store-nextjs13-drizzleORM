import { GamesGrid } from "@/components/Games";
import { Game } from "@/db/game/schema";
import { auth } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  relatedCategories?: string;
};
async function SimilarGames({ relatedCategories }: Props) {
  const { getToken } = auth();
  const similarGames = (await fetch(
    `http://localhost:3000/api/game?categories=${relatedCategories}`,
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }
  )
    .then((res) => res.json())
    .catch((e) => console.log(e))) as { data: { games: Game }[] };

  const transformedData = similarGames.data.map((obj) => ({
    ...obj.games, // Copy the existing properties
  }));

  return (
    <>
      <GamesGrid games={transformedData} />
    </>
  );
}

export default SimilarGames;
