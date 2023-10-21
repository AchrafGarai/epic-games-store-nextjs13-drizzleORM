import { relations } from "drizzle-orm";
import {
  date,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "../user/schema";
import { gamesToPlatforms } from "../platforms/schema";
import { media } from "../media/schema";

export const games = pgTable("games", {
  id: serial("id").primaryKey().notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  coverImageUrl: varchar("cover_image_url", { length: 256 }),
  bannerImageUrl: varchar("banner_image_url", { length: 256 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  releasedAt: date("released_at", { mode: "date" }),
  price: numeric("price"),
  stripeId: varchar("stripe_id", { length: 256 }),
  gameDescription: varchar("game_description", { length: 256 }).default("TBA"),
});

export const gamesRelations = relations(games, ({ many }) => ({
  categories: many(gamesToCategories),
  platforms: many(gamesToPlatforms),
  media: many(media),
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  games: many(gamesToCategories),
}));

export const gamesToCategories = pgTable(
  "games_to_categories",
  {
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
  },
  (t) => ({
    pk: primaryKey(t.gameId, t.categoryId),
  })
);

export const gamesToCategoriesRelations = relations(
  gamesToCategories,
  ({ one }) => ({
    category: one(categories, {
      fields: [gamesToCategories.categoryId],
      references: [categories.id],
    }),
    game: one(games, {
      fields: [gamesToCategories.gameId],
      references: [games.id],
    }),
  })
);

export const libraryItems = pgTable(
  "library_items",
  {
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    gameId: serial("game_id").notNull(),
    userId: serial("user_id").notNull(),
  },
  (t) => ({
    pk: primaryKey(t.gameId, t.userId),
  })
);

export const libraryItemsRelations = relations(libraryItems, ({ one }) => ({
  game: one(games, {
    fields: [libraryItems.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [libraryItems.userId],
    references: [users.id],
  }),
}));

export type Game = typeof games.$inferSelect;
export type CreateGame = typeof games.$inferInsert;
export type LibraryItem = typeof libraryItems.$inferSelect;
export type CreateLibraryItem = typeof libraryItems.$inferInsert;
export type Category = typeof categories.$inferSelect;
