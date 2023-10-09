import { Game } from "@/db/game/schema";
import React from "react";
import GameCard from "./GameCard";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridVariants = cva("grid gap-4", {
  variants: {
    variant: {
      default: "grid-cols-3 lg:grid-cols-4 ",
      reduced: "grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type GridProps = VariantProps<typeof gridVariants>;

interface Props extends GridProps {
  games: Game[];
  className?: string;
}

function GamesGrid({ games, variant, className }: Props) {
  return (
    <>
      <div className={cn(gridVariants({ variant, className }))}>
        {games.map((game) => (
          <GameCard game={game} key={game.id} />
        ))}
      </div>
    </>
  );
}

export default GamesGrid;
