import { Media } from "@/db/media/schema";
import React from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  media: Media[];
  activeMedia?: number;
};

function GameMedia({ media, activeMedia }: Props) {
  const currentScreenShot = activeMedia ? media[activeMedia] : media[0];
  return (
    <>
      {currentScreenShot && (
        <Image
          src={currentScreenShot.mediaUrl}
          width={1200}
          height={675}
          alt=""
        />
      )}
      {media.length > 1 && (
        <>
          <h4 className=" text-lg mb-4 font-medium mt-6 ">Screenshots</h4>
          <ScrollArea className="rounded-lg border mt-4 bg-neutral-900">
            <div className="p-4">
              <div className="flex gap-2">
                {media.map((media) => (
                  <>
                    <Image
                      src={media.mediaUrl}
                      width={200}
                      height={75}
                      alt=""
                      key={media.id}
                    />
                  </>
                ))}
              </div>
            </div>
          </ScrollArea>
        </>
      )}
    </>
  );
}

export default GameMedia;
