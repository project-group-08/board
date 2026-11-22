import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";

import type { Prisma } from "../../generated/prisma/client.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { createAuthToken, hashAuthToken } from "./auth-token.js";

const ACCESS_TTL = 15 * 60_000;
const REFRESH_TTL = 30 * 24 * 60 * 60_000;

function issueCredentials(now: Date) {
  const accessToken = createAuthToken();
  const refreshToken = createAuthToken();
  const accessExpiresAt = new Date(now.getTime() + ACCESS_TTL);
  const refreshExpiresAt = new Date(now.getTime() + REFRESH_TTL);

  return {
    cookies: { accessToken, refreshToken, accessExpiresAt, refreshExpiresAt },
    data: {
      access_token_hash: hashAuthToken(accessToken),
      refresh_token_hash: hashAuthToken(refreshToken),
      access_expires_at: accessExpiresAt,
      refresh_expires_at: refreshExpiresAt,
    },
  };
}

export type SessionCredentials = ReturnType<typeof issueCredentials>["cookies"];

@Injectable()
export class SessionService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(tx: Prisma.TransactionClient, userId: number, now: Date) {
    const { cookies, data } = issueCredentials(now);
    await tx.session.create({ data: { user_id: userId, ...data } });
    return cookies;
  }

  async refresh(refreshToken: string | undefined): Promise<SessionCredentials> {
    if (!refreshToken) {
      throw new UnauthorizedException("Сессия истекла");
    }

    const now = new Date();
    const { cookies, data } = issueCredentials(now);
    const { count } = await this.prisma.session.updateMany({
      where: {
        refresh_token_hash: hashAuthToken(refreshToken),
        refresh_expires_at: { gt: now },
        revoked_at: null,
      },
      data,
    });

    if (count === 0) {
      throw new UnauthorizedException("Сессия истекла");
    }

    return cookies;
  }

  async requireUser(accessToken: string | undefined) {
    if (!accessToken) {
      throw new UnauthorizedException("Сессия истекла");
    }

    const session = await this.prisma.session.findUnique({
      where: {
        access_token_hash: hashAuthToken(accessToken),
        access_expires_at: { gt: new Date() },
        revoked_at: null,
      },
      select: { user: { select: { id: true, username: true } } },
    });

    if (!session) {
      throw new UnauthorizedException("Сессия истекла");
    }

    return session.user;
  }

  async revoke(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ) {
    const credentials: Prisma.SessionWhereInput[] = [];
    if (refreshToken) {
      credentials.push({ refresh_token_hash: hashAuthToken(refreshToken) });
    }
    if (accessToken) {
      credentials.push({ access_token_hash: hashAuthToken(accessToken) });
    }

    if (credentials.length > 0) {
      await this.prisma.session.updateMany({
        where: { revoked_at: null, OR: credentials },
        data: { revoked_at: new Date() },
      });
    }
  }
}
