ALTER TABLE "media" DROP CONSTRAINT "media_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "media" DROP COLUMN IF EXISTS "game_id";