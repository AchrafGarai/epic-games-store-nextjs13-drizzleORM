import { db } from "@/db";
import { NextResponse } from "next/server";
import { categories, games, libraryItems } from "@/db/game/schema";
import { platforms } from "@/db/platforms/schema";

export async function GET() {
  //Load game categories from DB
  const data = await db.select().from(platforms);
  if (data.length >= 0) {
    return NextResponse.json({ data });
  } else {
    return NextResponse.json({ message: "Could't load data" }, { status: 404 });
  }
}
