import React from "react";
import FeaturedBanner from "./FeaturedBanner";
import FeaturedThumbnail from "./FeaturedThumbnail";
import { useGames } from "@/lib/games";
import { Game } from "@/db/game/schema";
type Props = {
  // games: Game[];
  featuredGame?: number;
  page: number;
};

async function FeaturedGames({ featuredGame, page }: Props) {
  const { data } = await useGames<Game>(1, {
    limit: "4",
  });
  const games = data;
  const featured = featuredGame
    ? games.find((game) => game.id === featuredGame)
    : games[0];

  return (
    <div className="grid grid-cols-8 gap-8 min-h-[360px]">
      <FeaturedBanner game={featured} />
      <ul className=" col-span-2">
        {games.map((game) => (
          <li key={game.id}>
            <FeaturedThumbnail
              page={page}
              game={game}
              variant={game.id === featured?.id ? "selected" : "default"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeaturedGames;

export const revalidate = 10;
