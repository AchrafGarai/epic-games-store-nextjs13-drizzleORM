import { Game } from "@/db/game/schema";
import React from "react";
import GameCard from "./GameCard";

type Props = {
  games: Game[];
};
function GamesGrid({ games }: Props) {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 w-full">
        {games.map((game) => (
          <GameCard game={game} key={game.id} />
        ))}
      </div>
    </>
  );
}

export default GamesGrid;
