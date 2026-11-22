import "reflect-metadata";
import { createHash, randomBytes } from "node:crypto";

import { InMemoryMailTransport, MailTransport } from "@nestjs/mail";
import { Test } from "@nestjs/testing";
import { afterEach, expect, it, vi } from "vitest";

import { AppModule } from "../src/app.module.js";
import { PrismaService } from "../src/prisma/prisma.service.js";

const token = randomBytes(32).toString("base64url");

function mockDatabase(username: string | null = null) {
  const tx = {
    emailVerificationToken: {
      updateManyAndReturn: vi
        .fn<() => Promise<{ email: string }[]>>()
        .mockResolvedValueOnce([{ email: "user@example.test" }])
        .mockResolvedValue([]),
    },
    user: {
      upsert: vi
        .fn<() => Promise<{ id: number; username: string | null }>>()
        .mockResolvedValue({ id: 1, username }),
      updateMany: vi
        .fn<() => Promise<{ count: number }>>()
        .mockResolvedValue({ count: 1 }),
      update: vi
        .fn<() => Promise<{ username: string }>>()
        .mockResolvedValue({ username: "Никита" }),
    },
    session: {
      create: vi.fn<() => Promise<object>>().mockResolvedValue({}),
      findUnique: vi
        .fn<() => Promise<{ user: { id: number; username: string | null } }>>()
        .mockResolvedValue({ user: { id: 1, username } }),
      updateMany: vi
        .fn<() => Promise<{ count: number }>>()
        .mockResolvedValueOnce({ count: 1 })
        .mockResolvedValue({ count: 0 }),
    },
  };

  return {
    ...tx,
    $transaction: vi.fn<
      (run: (client: typeof tx) => Promise<unknown>) => Promise<unknown>
    >((run) => run(tx)),
  };
}

async function setup(database: ReturnType<typeof mockDatabase>) {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue(database)
    .overrideProvider(MailTransport)
    .useValue(new InMemoryMailTransport())
    .compile();

  const app = module.createNestApplication({ logger: false });
  app.setGlobalPrefix("api");
  await app.listen(0, "127.0.0.1");
  const url = await app.getUrl();

  return {
    close: () => app.close(),
    request: (path: string, method: string, body?: object, cookie?: string) =>
      fetch(`${url}/api/auth/${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: body && JSON.stringify(body),
      }),
  };
}

let app: Awaited<ReturnType<typeof setup>> | undefined;

afterEach(async () => {
  await app?.close();
  app = undefined;
});

it("отклоняет ссылку, для которой нет действующего токена", async () => {
  const database = mockDatabase();
  database.emailVerificationToken.updateManyAndReturn
    .mockReset()
    .mockResolvedValue([]);
  app = await setup(database);

  const response = await app.request("email-link/verify", "POST", { token });

  expect(response.status).toBe(401);
  expect(database.user.upsert).not.toHaveBeenCalled();
  expect(database.session.create).not.toHaveBeenCalled();
});

it("погашает ссылку и выдаёт сессию только один раз", async () => {
  const database = mockDatabase();
  app = await setup(database);

  const responses = await Promise.all([
    app.request("email-link/verify", "POST", { token }),
    app.request("email-link/verify", "POST", { token }),
  ]);
  const success = responses.find((response) => response.ok);
  expect(
    responses.map((response) => response.status).sort((a, b) => a - b),
  ).toEqual([200, 401]);
  expect(await success?.json()).toEqual({ username: null, needsProfile: true });
  expect(database.session.create).toHaveBeenCalledTimes(1);

  expect(
    database.emailVerificationToken.updateManyAndReturn,
  ).toHaveBeenCalledWith({
    where: {
      token_hash: new Uint8Array(createHash("sha256").update(token).digest()),
      used_at: null,
      revoked_at: null,
      expires_at: { gt: expect.any(Date) },
    },
    data: { used_at: expect.any(Date) },
    select: { email: true },
  });
  expect(database.user.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      where: { email: "user@example.test" },
      create: expect.objectContaining({ email_verified_at: expect.any(Date) }),
    }),
  );
  const cookies = success?.headers.getSetCookie() ?? [];
  expect(cookies).toHaveLength(2);
  for (const cookie of cookies) {
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
  }
  expect(cookies[0]).toMatch(/^tabula_access=/);
  expect(cookies[1]).toMatch(/^tabula_refresh=/);
});

it("для существующего профиля не запрашивает имя повторно", async () => {
  app = await setup(mockDatabase("Никита"));
  const response = await app.request("email-link/verify", "POST", { token });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({
    username: "Никита",
    needsProfile: false,
  });
});

it("после обновления сессии прежний refresh больше не действует", async () => {
  const database = mockDatabase();
  app = await setup(database);
  const cookie = `tabula_refresh=${token}`;

  const response = await app.request("refresh", "POST", undefined, cookie);
  const replay = await app.request("refresh", "POST", undefined, cookie);

  expect(response.status).toBe(204);
  expect(response.headers.getSetCookie()).toHaveLength(2);
  expect(replay.status).toBe(401);
});

it("сохраняет имя только с действующим access", async () => {
  const database = mockDatabase();
  app = await setup(database);

  const denied = await app.request("profile", "PATCH", { username: "Никита" });
  const accepted = await app.request(
    "profile",
    "PATCH",
    { username: " Никита " },
    `tabula_access=${token}`,
  );

  expect(denied.status).toBe(401);
  expect(accepted.status).toBe(200);
  expect(await accepted.json()).toEqual({
    username: "Никита",
    needsProfile: false,
  });
  expect(database.user.update).toHaveBeenCalledTimes(1);
});

it("при выходе отзывает сессию и очищает обе cookie", async () => {
  const database = mockDatabase();
  app = await setup(database);
  const response = await app.request(
    "logout",
    "POST",
    undefined,
    `tabula_refresh=${token}`,
  );

  expect(response.status).toBe(204);
  expect(database.session.updateMany).toHaveBeenCalledTimes(1);
  expect(response.headers.getSetCookie()).toHaveLength(2);
  expect(
    response.headers
      .getSetCookie()
      .every((cookie) => cookie.includes("Max-Age=0")),
  ).toBe(true);
});
