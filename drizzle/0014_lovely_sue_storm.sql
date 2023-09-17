DO $$ BEGIN
 CREATE TYPE "media_type" AS ENUM('video', 'image');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"media_id" serial PRIMARY KEY NOT NULL,
	"media_url" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"media_type" "media_type",
	"game_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
