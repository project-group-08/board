BEGIN;

ALTER TABLE "sessions" ADD COLUMN "refresh_family_hash" BYTEA;

UPDATE "sessions" SET "refresh_family_hash" = "refresh_token_hash";

ALTER TABLE "sessions"
  ALTER COLUMN "refresh_family_hash" SET NOT NULL,
  ADD CONSTRAINT "sessions_refresh_family_length_check" CHECK (octet_length("refresh_family_hash") = 32);

CREATE UNIQUE INDEX "sessions_refresh_family_hash_key" ON "sessions"("refresh_family_hash");

COMMIT;
