import GameDetails from "@/components/Games/GameDetails";
import GameMedia from "@/components/Games/GameMedia";
import { Separator } from "@/components/ui/separator";
import { Category, Game } from "@/db/game/schema";
import { Media, media } from "@/db/media/schema";
import { Platform } from "@/db/platforms/schema";
import { auth } from "@clerk/nextjs/server";
import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};
async function GameDetailsPage({ params, searchParams }: Props) {
  const { id } = params;
  const activeImage = Number(searchParams?.image);
  const { getToken } = auth();
  // Response type
  type Response = {
    data: Game & {
      media: Media[];
      platforms: {
        platform: Platform;
      }[];
      categories: {
        category: Category;
      }[];
    };
  };

  const { data } = (await fetch(`http://localhost:3000/api/game/${id}`, {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })
    .then((res) => res.json())
    .catch((e) => console.log(e))) as Response;
  const game = data;

  return (
    game && (
      <div className="flex gap-8">
        <div className="flex-grow ">
          <div>
            <p className=" text-2xl font-medium my-5">{game.title}</p>
          </div>
          {media && (
            <GameMedia
              media={game.media}
              gameId={id}
              activeMedia={activeImage}
            />
          )}
        </div>
        <div className=" p-8 py-10 w-90 bg-neutral-900 rounded-xl">
          {game.coverImageUrl && (
            <Image
              src={game.coverImageUrl}
              height={200}
              width={300}
              alt={game.title}
              className=" mb-8"
            />
          )}
          <GameDetails game={game} />
        </div>
      </div>
    )
  );
}

export default GameDetailsPage;
