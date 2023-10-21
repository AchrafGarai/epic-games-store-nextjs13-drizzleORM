CREATE TABLE IF NOT EXISTS "games_to_categories" (
	"game_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT games_to_categories_game_id_category_id PRIMARY KEY("game_id","category_id")
);
--> statement-breakpoint
DROP TABLE "users_to_groups";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games_to_categories" ADD CONSTRAINT "games_to_categories_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games_to_categories" ADD CONSTRAINT "games_to_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
