import { db } from "@/db";
import { NextResponse } from "next/server";

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
    },
  });
  return NextResponse.json({ data });
}
