import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Media } from "@/db/media/schema";
import { cn } from "@/lib/utils";

type Props = {
  media: Media;
  index: number;
  gameId: string;
  activeMedia: number | undefined;
};

function GameMediaThumbnail({ media, index, gameId, activeMedia }: Props) {
  return (
    <>
      <Link
        className={`${
          activeMedia === index
            ? "outline outline-2 outline-neutral-200 rounded-md"
            : ""
        }`}
        scroll={false}
        key={media.id}
        href={`/games/${gameId}?image=${index}`}
      >
        <Image
          src={media.mediaUrl}
          width={180}
          height={75}
          alt=""
          className="rounded-md"
        />
      </Link>
    </>
  );
}

export default GameMediaThumbnail;
