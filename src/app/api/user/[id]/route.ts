import { db } from "@/db";
import { NextResponse } from "next/server";
import { libraryItems } from "@/db/game/schema";
import { users } from "@/db/user/schema";
import { games } from "@/db/game/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    const data = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ e });
  }
}
