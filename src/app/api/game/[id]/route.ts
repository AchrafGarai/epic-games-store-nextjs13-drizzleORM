import { NextResponse } from "next/server";
import { db } from "@/db";
import { games, categories, libraryItems } from "@/db/game/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { users } from "@/db/user/schema";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  const id = Number(params.id); // 'a', 'b', or 'c'
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
  let isOwned = false;
  if (userId) {
    const user = await db.query.users.findFirst({
      where: eq(users.authId, userId),
    });

    if (user) {
      isOwned = (await db.query.libraryItems.findFirst({
        where: and(
          eq(libraryItems.gameId, id),
          eq(libraryItems.userId, user.id)
        ),
      }))
        ? true
        : false;
    }
  }
  return NextResponse.json({ data, isOwned });
}

// export const revalidate = 1 // revalidate at most every hour
