CREATE TABLE IF NOT EXISTS "library_item" (
	"created_at" timestamp DEFAULT now(),
	"game_id" serial NOT NULL,
	"user_id" serial NOT NULL,
	CONSTRAINT library_item_game_id_user_id PRIMARY KEY("game_id","user_id")
);
