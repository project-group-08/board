import "reflect-metadata";
import { InMemoryMailTransport, MailTransport } from "@nestjs/mail";
import { Test } from "@nestjs/testing";
import { afterEach, expect, it, vi } from "vitest";

import { AppModule } from "../src/app.module.js";
import { PrismaService } from "../src/prisma/prisma.service.js";

afterEach(() => {
  vi.unstubAllEnvs();
});

it("возвращает 400, если передали неверный email", async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue({
      emailVerificationToken: {
        create: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
      },
    })
    .compile();
  const app = module.createNestApplication({ logger: false });

  try {
    app.setGlobalPrefix("api");
    await app.listen(0, "127.0.0.1");

    const response = await fetch(`${await app.getUrl()}/api/auth/email-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test" }),
    });

    expect(response.status).toBe(400);
  } finally {
    await app.close();
  }
});

it("записывает и отправляет ссылку на один нормализованный email", async () => {
  vi.stubEnv("APP_URL", "http://localhost:3000");

  const create = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mailbox = new InMemoryMailTransport();
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue({
      emailVerificationToken: {
        create,
      },
    })
    .overrideProvider(MailTransport)
    .useValue(mailbox)
    .compile();
  const app = module.createNestApplication({ logger: false });

  try {
    app.setGlobalPrefix("api");
    await app.listen(0, "127.0.0.1");

    const response = await fetch(`${await app.getUrl()}/api/auth/email-link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "Test@Example.test" }),
    });

    expect(response.status).toBe(204);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: "test@example.test" }),
      }),
    );
    expect(mailbox.mails[0]?.message.envelope.to).toEqual([
      "test@example.test",
    ]);
  } finally {
    await app.close();
  }
});

it("отправляет только одну ссылку при двух быстрых запросах", async () => {
  vi.stubEnv("APP_URL", "http://localhost:3000");

  const create = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mailbox = new InMemoryMailTransport();

  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue({ emailVerificationToken: { create } })
    .overrideProvider(MailTransport)
    .useValue(mailbox)
    .compile();

  const app = module.createNestApplication({ logger: false });

  try {
    app.setGlobalPrefix("api");
    await app.listen(0, "127.0.0.1");

    const url = `${await app.getUrl()}/api/auth/email-link`;
    const request = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.test" }),
    };

    const first = await fetch(url, request);
    const second = await fetch(url, request);

    expect(first.status).toBe(204);
    expect(second.status).toBe(429);
    expect(create).toHaveBeenCalledTimes(1);
    expect(mailbox.mails).toHaveLength(1);
  } finally {
    await app.close();
  }
});

it("отправляет больше запросов с одного ip, чем допустимо", async () => {
  vi.stubEnv("APP_URL", "http://localhost:3000");

  const create = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mailbox = new InMemoryMailTransport();

  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue({ emailVerificationToken: { create } })
    .overrideProvider(MailTransport)
    .useValue(mailbox)
    .compile();

  const app = module.createNestApplication({ logger: false });

  try {
    app.setGlobalPrefix("api");
    await app.listen(0, "127.0.0.1");

    const url = `${await app.getUrl()}/api/auth/email-link`;
    const statuses: number[] = [];

    for (let i = 1; i <= 6; i += 1) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: `test${i}@example.test` }),
      });

      statuses.push(response.status);
    }

    expect(statuses).toEqual([204, 204, 204, 204, 204, 429]);
    expect(create).toHaveBeenCalledTimes(5);
    expect(mailbox.mails).toHaveLength(5);
  } finally {
    await app.close();
  }
});

it("возвращает 400, если токен имеет неверный формат", async () => {
  vi.stubEnv("APP_URL", "http://localhost:3000");
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue({
      emailVerificationToken: {
        create: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
      },
    })
    .compile();
  const app = module.createNestApplication({ logger: false });

  try {
    app.setGlobalPrefix("api");
    await app.listen(0, "127.0.0.1");

    const response = await fetch(
      `${await app.getUrl()}/api/auth/email-link/verify`,
      {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: "short" }),
      },
    );

    expect(response.status).toBe(400);
  } finally {
    await app.close();
  }
});
