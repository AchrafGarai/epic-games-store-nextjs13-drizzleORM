import { NextResponse } from "next/server";
import { db } from "@/db";
import { games, categories } from "@/db/game/schema";
import { platforms } from "@/db/platforms/schema";
import { media } from "@/db/media/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id); // 'a', 'b', or 'c'
  const data = await db
    .select()
    .from(games)
    .where(eq(games.id, id))
    .leftJoin(categories, eq(games.id, categories.id))
    .leftJoin(platforms, eq(games.id, platforms.platformId))
    .leftJoin(media, eq(games.id, media.id));
  return NextResponse.json({ data });
}
