CREATE TABLE "sessions" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "access_token_hash" BYTEA NOT NULL,
    "refresh_token_hash" BYTEA NOT NULL,
    "access_expires_at" TIMESTAMPTZ(6) NOT NULL,
    "refresh_expires_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "sessions_access_token_hash_key" ON "sessions"("access_token_hash");

CREATE UNIQUE INDEX "sessions_refresh_token_hash_key" ON "sessions"("refresh_token_hash");

CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

CREATE INDEX "sessions_refresh_expires_at_idx" ON "sessions"("refresh_expires_at");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sessions"
  ADD CONSTRAINT "sessions_access_hash_length_check" CHECK (octet_length("access_token_hash") = 32),
  ADD CONSTRAINT "sessions_refresh_hash_length_check" CHECK (octet_length("refresh_token_hash") = 32),
  ADD CONSTRAINT "sessions_token_expiry_check" CHECK ("access_expires_at" <= "refresh_expires_at");
