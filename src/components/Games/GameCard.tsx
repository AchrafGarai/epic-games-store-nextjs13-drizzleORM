import React from "react";
import { Game } from "@/db/game/schema";
import Link from "next/link";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Props = {
  game: Game;
};

function GameCard({ game }: Props) {
  return (
    <Link
      className="flex flex-col mb-8 hover:opacity-50 transition-opacity ease-in"
      href={`/games/${game.id}`}
    >
      {game.coverImageUrl && (
        <AspectRatio ratio={9 / 14} className="relative mb-4 ">
          <Image
            className="h-full object-cover"
            src={game.coverImageUrl}
            width={400}
            height={300}
            alt=""
          />
        </AspectRatio>
      )}
      <p className="text-xl font-medium">{game.title}</p>
      <p className=" text-neutral-500 font-semibold">${game.price}</p>
    </Link>
  );
}

export default GameCard;
