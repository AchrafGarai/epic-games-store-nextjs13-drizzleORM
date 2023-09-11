import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

// declaring enum in database
export const popularityEnum = pgEnum('popularity', [
  'unknown',
  'known',
  'popular',
])

export const countries = pgTable(
  'countries',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
  },
  (countries) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(countries.name),
    }
  },
)

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
  popularity: popularityEnum('popularity'),
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  authId: varchar('auth_id', { length: 256 }),
  email: varchar('email', { length: 256 }),
  profilePictureUrl: varchar('profile_picture_url', { length: 256 }),
  username: varchar('username', { length: 256 }),
  firstName: varchar('first_name', { length: 256 }),
  LastName: varchar('last_name', { length: 256 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
})

export type User = typeof users.$inferSelect
export type CreateUser = typeof users.$inferInsert
