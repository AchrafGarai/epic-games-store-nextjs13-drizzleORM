import React from "react";
import { Game } from "@/db/game/schema";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

function FeaturedBanner({ game }: { game: Game | undefined }) {
  return (
    <div className="col-span-6 relative  rounded-3xl overflow-hidden animate-fade-in transition-all">
      <div className="absolute z-20 p-12 bottom-0 w-full flex flex-col gap-2 items-start">
        <h1 className=" text-3xl font-medium">{game?.title}</h1>
        <p>{game?.title}</p>
        <p className=" text-xl font-medium mb-4">${game?.price}</p>
        <Link
          className={buttonVariants({ variant: "default" })}
          href={`/games/${game?.id}`}
        >
          Buy now
        </Link>
      </div>
      <Image
        src={game?.bannerImageUrl ? game?.bannerImageUrl : ""}
        alt=""
        fill
        className="w-full h-full absolute z-10"
      />
    </div>
  );
}

export default FeaturedBanner;
