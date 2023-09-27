import React from "react";
import { Game } from "@/db/game/schema";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import FeaturedBanner from "./FeaturedBanner";
import FeaturedThumbnail from "./FeaturedThumbnail";
type Props = {
  games: Game[];
  featuredGame?: number;
};

function FeaturedGames({ games, featuredGame }: Props) {
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
              featuredId={1}
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
