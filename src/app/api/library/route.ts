import { db } from "@/db";
import { NextResponse } from "next/server";
import {
  categories,
  games,
  gamesRelations,
  gamesToCategories,
  libraryItems,
} from "@/db/game/schema";
import { users } from "@/db/user/schema";
import { eq, and, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { gamesToPlatforms } from "@/db/platforms/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { userId } = await auth();

  const limit = Number(searchParams.get("limit"));
  const offset = Number(searchParams.get("offset")) || 0;

  const categoriesParams = searchParams.get("categories")?.split("|") || null;
  const platformParams = searchParams.get("platforms")?.split("|") || null;

  if (userId) {
    const user = await db.query.users.findFirst({
      where: eq(users.authId, userId),
      columns: {
        id: true,
      },
    });
    if (user?.id) {
      const categoriesFilter = categoriesParams
        ? categoriesParams.map((category) => Number(category))
        : null;

      const platformFilters = platformParams?.map((platform) =>
        Number(platform)
      );

      let conditions = [eq(libraryItems.userId, 24)];

      categoriesFilter &&
        conditions.push(
          inArray(gamesToCategories.categoryId, categoriesFilter)
        );

      platformFilters &&
        conditions.push(inArray(gamesToPlatforms.id, platformFilters));
      const res = await db
        .select()
        .from(games)
        .leftJoin(libraryItems, eq(libraryItems.gameId, games.id))
        .leftJoin(gamesToCategories, eq(gamesToCategories.gameId, games.id))
        .leftJoin(gamesToPlatforms, eq(gamesToPlatforms.gameId, games.id))
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);
      const data = res.flatMap((obj: any) => obj.games);
      return NextResponse.json({ data });
    }
  }
}

// export const revalidate = 1;
