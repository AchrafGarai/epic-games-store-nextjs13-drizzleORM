import { Game } from "@/db/game/schema";
import React from "react";
import { Separator } from "@/components/ui/separator";
import DataCell from "@/components/ui/data-cell";
import { Button } from "@/components/ui/button";
import { Media } from "@/db/media/schema";
import { Platform } from "@/db/platforms/schema";
import { Category } from "@/db/game/schema";
import { getCategoryNames, getPlatformNames } from "@/utils/helpers/Games";

type Props = {
  game: Game & {
    media: Media[];
    platforms: {
      platform: Platform;
    }[];
    categories: {
      category: Category;
    }[];
  };
};

export default function GameDetails({ game }: Props) {
  const releaseDate = new Date(game.releasedAt || "");
  const dateString = releaseDate.toLocaleDateString() || "TBA";
  const categories = getCategoryNames(game.categories) || "TBA";
  const platforms = getPlatformNames(game.platforms) || "TBA";

  return (
    <div className="flex flex-col gap-2 my-3 ">
      <p className=" text-2xl font-medium mb">{game.title}</p>
      <p className=" text-neutral-300 text-md mb-3">$ {game.price}</p>
      <Button className=" uppercase">Buy</Button>
      <Separator className=" mb-5" />
      <DataCell title="Release Date">{dateString}</DataCell>
      {categories && <DataCell title="Categories">{categories}</DataCell>}
      {platforms && <DataCell title="Platfroms">{platforms}</DataCell>}
    </div>
  );
}
