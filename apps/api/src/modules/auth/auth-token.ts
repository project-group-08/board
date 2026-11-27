import { createHash, randomBytes } from "node:crypto";

export function createAuthToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashAuthToken(token: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array(createHash("sha256").update(token).digest());
}
