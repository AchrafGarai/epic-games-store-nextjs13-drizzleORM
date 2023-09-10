import { users, CreateUser } from '@/db/schema'
import db from '@/db'
import { eq } from 'drizzle-orm'

export const createUser = async (user: CreateUser) => {
  await db
    .insert(users)
    .values({
      authId: user.authId,
      profilePictureUrl: user.profilePictureUrl,
      email: user.email,
      username: user.email,
      firstName: user.firstName,
      LastName: user.LastName,
      createdAt: user.createdAt,
    })
    .returning()
}

export const deleteUser = async (userId: string) => {
  await db
    .delete(users)
    .where(eq(users.authId, userId))
    .returning({ deletedId: users.authId })
}
