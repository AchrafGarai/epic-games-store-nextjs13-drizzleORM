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
  // const res = await db
  //   .select()
  //   .from(games)
  //   .where(eq(games.id, id))
  //   .leftJoin(media, eq(media.id, id))
  //   .leftJoin(categories, eq(categories.id, id))
  //   .leftJoin(platforms, eq(platforms.platformId, id));
  const data = await db.query.games.findFirst({
    where: eq(games.id, id),
    with: {
      media: true,
      categories: {
        with: {
          category: true,
        },
      },
      platforms: {
        with: {
          platform: true,
        },
      },
    },
  });

  return NextResponse.json({ data });
}

// export const revalidate = 1; // revalidate at most every hour
