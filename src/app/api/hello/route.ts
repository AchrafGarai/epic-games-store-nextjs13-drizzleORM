import { db } from "@/db";
import { NextResponse } from "next/server";
import { games, libraryItems } from "@/db/game/schema";
import { users } from "@/db/user/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  return NextResponse.json({ hello: "world" });
  // const data = id
}
