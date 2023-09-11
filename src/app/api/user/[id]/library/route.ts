import { db } from '@/db'
import { NextResponse } from 'next/server'
import { games, libraryItems } from '@/db/game/schema'
import { users } from '@/db/user/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: number } },
) {
  const id = params.id
  try {
    const data = await db.select().from(libraryItems).where(eq(users.id, 23))

    console.log(data)
    return NextResponse.json({ id })
  } catch (e) {
    return NextResponse.json({ e })
  }
  // const data = id
}
