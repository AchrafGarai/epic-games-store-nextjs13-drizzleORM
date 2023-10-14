import React from "react";
import { Game } from "@/db/game/schema";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

function FeaturedBanner({ game }: { game: Game | undefined }) {
  return (
    <div className="col-span-8 flex-grow md:col-span-6">
      <div className="relative  rounded-3xl overflow-hidden animate-fade-in transition-all h-[360px] md:h-[540px] ">
        <div className="absolute z-30 p-6 bottom-0 w-full flex flex-col gap-2 items-start max-w-md md:12">
          <h1 className=" text-3xl font-medium">{game?.title}</h1>
          <p className=" text-xl font-medium">${game?.price}</p>
          <p className="text-neutral-300 text-ellipsis overflow-hidden max-h-12  mb-4">
            {game?.gameDescription}
          </p>
          <Link
            className={buttonVariants({ variant: "default" })}
            href={`/games/${game?.id}`}
          >
            Buy now
          </Link>
        </div>
        <div className=" absolute w-1/2 h-full bg-gradient-to-r from-black  opacity-70 z-20 "></div>
        <Image
          src={game?.bannerImageUrl ? game?.bannerImageUrl : ""}
          alt=""
          fill
          className="w-full h-full absolute z-10 object-cover"
        />
      </div>
    </div>
  );
}

export default FeaturedBanner;
