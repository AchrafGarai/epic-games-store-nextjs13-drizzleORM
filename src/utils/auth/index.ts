import { users, CreateUser } from '@/db/user/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

export const createUser = async (user: CreateUser) => {
  await db
    .insert(users)
    .values({ ...user })
    .returning()
}

export const deleteUser = async (userId: string) => {
  await db
    .delete(users)
    .where(eq(users.authId, userId))
    .returning({ deletedId: users.authId })
}

export const updateUser = async (user: CreateUser) => {
  // const userId = user.authId || ''
  if (user.authId) {
    await db
      .update(users)
      .set({ ...user })
      .where(eq(users.authId, user.authId))
  }
}
