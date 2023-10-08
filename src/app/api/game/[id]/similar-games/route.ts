import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, games, gamesToCategories } from "@/db/game/schema";
import { and, eq, inArray, ne } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id); // 'a', 'b', or 'c'
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) | 4;
  const categoriesParam = searchParams.get("categories")?.split("|");
  let conditions = [ne(games.id, id)];
  categoriesParam && conditions.push(inArray(categories.name, categoriesParam));

  const res = await db
    .select({ games })
    .from(gamesToCategories)
    .innerJoin(games, eq(gamesToCategories.gameId, games.id))
    .innerJoin(categories, eq(gamesToCategories.categoryId, categories.id))
    .where(and(...conditions))
    .limit(limit);

  const data = res.flatMap((obj: any) => obj.games);

  return NextResponse.json({ data });
}

export const revalidate = 1;
