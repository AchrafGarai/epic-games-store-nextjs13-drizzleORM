import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
export async function GET() {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return NextResponse.json({ user });
}
