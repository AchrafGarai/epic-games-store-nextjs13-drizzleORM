import { db } from "@/db";
import { categories, games, platforms } from "@/db/game/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.query.games.findMany({
    with: {
      categories: {
        columns: {
          categoryId: false,
          gameId: false,
        },
        with: {
          category: {
            columns: {
              name: true,
            },
          },
        },
      },
      platforms: {
        columns: {},
        with: {
          platform: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  });
  // const data = await db
  //   .select()
  //   .from(games)
  //   .leftJoin(platforms, eq(games.id, platforms.platformId))
  //   .leftJoin(categories, eq(games.id, categories.id));
  return NextResponse.json({ data });
}

export const revalidate = 1;
