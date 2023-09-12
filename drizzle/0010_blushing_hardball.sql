CREATE TABLE IF NOT EXISTS "platforms" (
	"name" varchar(256) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "platforms_name_unique" UNIQUE("name")
);
