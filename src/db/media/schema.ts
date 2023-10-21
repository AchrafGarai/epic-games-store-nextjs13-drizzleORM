import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { games } from "../game/schema";

// declaring enum in database
export const mediaType = pgEnum("media_type", ["video", "image"]);

export const media = pgTable("media", {
  id: serial("media_id").primaryKey().notNull(),
  mediaUrl: varchar("media_url", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  mediaType: mediaType("media_type"),
  gameId: integer("game_id").references(() => games.id),
});

export const mediaRelations = relations(media, ({ one }) => ({
  gameId: one(games, {
    fields: [media.gameId],
    references: [games.id],
  }),
}));

export type Media = typeof media.$inferSelect;
