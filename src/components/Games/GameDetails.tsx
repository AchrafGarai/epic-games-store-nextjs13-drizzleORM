import { Game } from "@/db/game/schema";
import React from "react";
import { Separator } from "@/components/ui/separator";
import DataCell from "@/components/ui/data-cell";
import { Button } from "@/components/ui/button";

export default function GameDetails({ game }: { game: Game }) {
  const releaseDate = new Date(game.releasedAt || "");
  const dateString = releaseDate.toLocaleDateString();

  return (
    <div className="flex flex-col gap-2 my-3 ">
      <p className=" text-xl font-medium mb">{game.title}</p>
      <p className=" text-neutral-300 text-lg mb-3">$ {game.price}</p>
      <Button className=" uppercase">Buy</Button>
      <Separator className=" mb-5" />
      <DataCell title="Release Date">{dateString}</DataCell>
      <DataCell title="Categories">{dateString}</DataCell>
      <DataCell title="Platfroms">{dateString}</DataCell>
    </div>
  );
}
