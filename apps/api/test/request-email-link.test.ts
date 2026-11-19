import "reflect-metadata";
import { Test } from "@nestjs/testing";
import { expect, it, vi } from "vitest";
import { PrismaService } from "../src/prisma/prisma.service.js";

import { AppModule } from "../src/app.module.js";
import { InMemoryMailTransport, MailTransport } from "@nestjs/mail";

it("возвращает 400, если передали неверный email", async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue({
    emailVerificationToken: { create: vi.fn().mockResolvedValue(undefined) },
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


it("возвращает 204, если передали верный email", async () => {
  vi.stubEnv("APP_URL", "http://localhost:3000");
  
  const mailbox = new InMemoryMailTransport();
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue({
    emailVerificationToken: { create: vi.fn().mockResolvedValue(undefined) },
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
      body: JSON.stringify({ email: "test@example.test" }),
    });

    expect(response.status).toBe(204);
    mailbox.assertSent({to: "test@example.test"})
  } finally {
    await app.close();
  }
});