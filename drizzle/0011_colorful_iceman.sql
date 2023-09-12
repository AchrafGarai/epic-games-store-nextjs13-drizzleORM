CREATE TABLE IF NOT EXISTS "games_to_platforms" (
	"game_id" integer NOT NULL,
	"platform" integer NOT NULL,
	CONSTRAINT games_to_platforms_game_id_platform PRIMARY KEY("game_id","platform")
);
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'platforms'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "platforms" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "platforms" ADD COLUMN "platform_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games_to_platforms" ADD CONSTRAINT "games_to_platforms_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games_to_platforms" ADD CONSTRAINT "games_to_platforms_platform_platforms_platform_id_fk" FOREIGN KEY ("platform") REFERENCES "platforms"("platform_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "platforms" ADD CONSTRAINT "platforms_platform_id_unique" UNIQUE("platform_id");