import { db } from "@/db";
import { NextResponse } from "next/server";
import { libraryItems } from "@/db/game/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    const data = await db.query.libraryItems.findMany({
      where: eq(libraryItems.userId, id),
      columns: {},
      with: {
        game: true,
      },
    });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ e });
  }
}
