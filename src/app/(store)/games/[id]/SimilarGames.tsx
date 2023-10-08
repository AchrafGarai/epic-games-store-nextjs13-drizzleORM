import { GamesGrid } from "@/components/Games";
import { useGames } from "@/lib/games";
import React from "react";

type Props = {
  relatedCategories?: string;
  searchParams?: { [key: string]: string | string[] | undefined };
  gameId: number;
};
async function SimilarGames({ relatedCategories, gameId }: Props) {
  const page = 1;
  const categoriesQuery = {
    categories: relatedCategories,
  };
  const similarGames = await useGames(
    page,
    categoriesQuery,
    `game/${gameId}/similar-games`
  );

  return (
    <div className="mb-12">
      <GamesGrid games={similarGames.data} />
    </div>
  );
}

export default SimilarGames;
