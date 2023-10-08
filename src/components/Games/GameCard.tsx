import React from "react";
import { Game } from "@/db/game/schema";
import Link from "next/link";
import Image from "next/image";

type Props = {
  game: Game;
};

function GameCard({ game }: Props) {
  return (
    <Link
      className="flex flex-col hover:opacity-50 transition-opacity ease-in"
      href={`/games/${game.id}`}
    >
      {game.coverImageUrl && (
        <Image
          className=" mb-4"
          src={game.coverImageUrl}
          width={400}
          height={300}
          alt=""
        />
      )}
      <p className=" text-xl font-medium">{game.title}</p>
      <p>${game.price}</p>
    </Link>
  );
}

export default GameCard;
