import { db } from "@/db";
import { NextResponse } from "next/server";
import { libraryItems } from "@/db/game/schema";
import { users } from "@/db/user/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/app-beta";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const limit = Number(searchParams.get("limit"));
  const offset = Number(searchParams.get("offset")) || null;
  try {
    if (userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.authId, userId),
        columns: {
          id: true,
        },
      });
      if (user) {
        const response = await db.query.libraryItems.findMany({
          where: eq(libraryItems.userId, user.id),
          with: {
            game: true,
          },
          limit: limit,
          offset: offset ? offset : undefined,
        });
        const data = response.map((item: any) => {
          const { game, ...rest } = item;
          return { ...game, ...rest };
        });

        return NextResponse.json({ data });
      } else {
        return NextResponse.json({ error: "unable to load library" });
      }
    } else {
      return NextResponse.json({ error: "unable to load library" });
    }
  } catch (e) {
    return NextResponse.json({ e });
  }
}

export const revalidate = 1;
