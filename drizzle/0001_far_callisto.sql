CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"auth_id" varchar(256),
	"email" varchar(256),
	"profile_picture_url" varchar(256)
);
