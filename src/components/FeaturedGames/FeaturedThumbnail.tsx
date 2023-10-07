import React from "react";
import { Game } from "@/db/game/schema";
import Image from "next/image";
import Link from "next/link";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const Variants = cva("flex gap-2 mb-4 p-3 rounded-xl  transition-all", {
  variants: {
    variant: {
      default: "",
      selected: "bg-neutral-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
type CardBaseProps = VariantProps<typeof Variants>;
type Props = CardBaseProps & {
  game: Game;
  page: number;
};

function FeaturedThumbnail({ game, variant, page }: Props) {
  const pageQuery = `&page=${page}`;
  const coverUrl = game.coverImageUrl ? game.coverImageUrl : "";
  return (
    <Link
      href={`/?featured=${game.id}${pageQuery}`}
      className={cn(Variants({ variant }))}
    >
      <Image
        src={coverUrl}
        height={80}
        width={60}
        alt=""
        className=" rounded-sm"
      />
      <div className="flex flex-col">
        <p className="p-2 font-medium">{game.title}</p>
        <p className="p-2 text-sm">${game.price}</p>
      </div>
    </Link>
  );
}

export default FeaturedThumbnail;
