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
import { games } from "../game/schema";

export const platforms = pgTable("platforms", {
  id: serial("platform_id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const PlatformsRelations = relations(platforms, ({ many }) => ({
  games: many(gamesToPlatforms),
}));

export const gamesToPlatforms = pgTable(
  "games_to_platforms",
  {
    gameId: integer("game_id")
      .notNull()
      .references(() => games.id),
    id: integer("platform")
      .notNull()
      .references(() => platforms.id),
  },
  (t) => ({
    pk: primaryKey(t.gameId, t.id),
  })
);

export const gamesToPlatformsRelations = relations(
  gamesToPlatforms,
  ({ one }) => ({
    game: one(games, {
      fields: [gamesToPlatforms.gameId],
      references: [games.id],
    }),
    platform: one(platforms, {
      fields: [gamesToPlatforms.id],
      references: [platforms.id],
    }),
  })
);

export type Platform = typeof platforms.$inferSelect;
