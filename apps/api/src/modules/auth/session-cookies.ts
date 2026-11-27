import type { ServerResponse } from "node:http";

import type { SessionCredentials } from "./session.service.js";

export const ACCESS_COOKIE = "tabula_access";
export const REFRESH_COOKIE = "tabula_refresh";

const COOKIE_ATTRIBUTES = "Path=/; HttpOnly; Secure; SameSite=Lax";

export function readSessionCookie(header: string | undefined, name: string) {
  const prefix = `${name}=`;
  const value = header
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);

  const pattern =
    name === REFRESH_COOKIE
      ? /^[A-Za-z0-9_-]{43}(?:\.[A-Za-z0-9_-]{43})?$/
      : /^[A-Za-z0-9_-]{43}$/;
  return value && pattern.test(value) ? value : undefined;
}

export function setSessionCookies(
  response: ServerResponse,
  session: SessionCredentials,
) {
  response.setHeader("Set-Cookie", [
    `${ACCESS_COOKIE}=${session.accessToken}; ${COOKIE_ATTRIBUTES}; Expires=${session.accessExpiresAt.toUTCString()}`,
    `${REFRESH_COOKIE}=${session.refreshToken}; ${COOKIE_ATTRIBUTES}; Expires=${session.refreshExpiresAt.toUTCString()}`,
  ]);
}

export function clearSessionCookies(response: ServerResponse) {
  response.setHeader("Set-Cookie", [
    `${ACCESS_COOKIE}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`,
    `${REFRESH_COOKIE}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`,
  ]);
}
