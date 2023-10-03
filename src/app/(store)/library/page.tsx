import { GamesGrid } from "@/components/Games";
import { Game } from "@/db/game/schema";
import React, { cache } from "react";
import { auth } from "@clerk/nextjs";
import { NextRequest } from "next/server";

async function Library() {
  const { getToken } = auth();
  const { data } = await fetch("http://localhost:3000/api/my-library", {
    headers: { Authorization: `Bearer ${await getToken()}` },
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

  return (
    <>
      <div className="flex-grow pt-4">
        <h1 className=" mb-8 text-4xl font-medium">Library</h1>
        <GamesGrid games={data} variant={"reduced"} />
      </div>
    </>
  );
}

export default Library;
