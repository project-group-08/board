import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Mailer } from "@nestjs/mail";
import type { AuthSession } from "@tabula/contracts/http/auth";

import { PrismaService } from "../../prisma/prisma.service.js";
import { createAuthToken, hashAuthToken } from "./auth-token.js";
import { SessionService } from "./session.service.js";

const EMAIL_LINK_TTL = 15 * 60_000;
const EMAIL_LINK_COOLDOWN = 60_000;

function profile(username: string | null): AuthSession {
  return { username, needsProfile: username === null };
}

@Injectable()
export class AuthService {
  private readonly emailLinkCooldowns = new Set<string>();

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(Mailer) private readonly mailer: Mailer,
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(SessionService) private readonly sessions: SessionService,
  ) {}

  async requestEmailLink(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    if (this.emailLinkCooldowns.has(normalizedEmail)) {
      throw new HttpException(
        "Подождите перед повторной отправкой ссылки",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const link = new URL(
      "/auth/confirm",
      this.config.getOrThrow<string>("APP_URL"),
    );
    const token = createAuthToken();
    link.hash = new URLSearchParams({ token }).toString();

    this.emailLinkCooldowns.add(normalizedEmail);
    setTimeout(() => {
      this.emailLinkCooldowns.delete(normalizedEmail);
    }, EMAIL_LINK_COOLDOWN).unref();

    await this.prisma.emailVerificationToken.create({
      data: {
        email: normalizedEmail,
        token_hash: hashAuthToken(token),
        expires_at: new Date(Date.now() + EMAIL_LINK_TTL),
      },
    });

    await this.mailer.send({
      to: email,
      subject: "Вход в Tabula",
      text: `Перейдите по ссылке для входа: ${link.href}`,
    });
  }

  verifyEmailLink(token: string) {
    const hash = hashAuthToken(token);

    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const [verification] =
        await tx.emailVerificationToken.updateManyAndReturn({
          where: {
            token_hash: hash,
            used_at: null,
            revoked_at: null,
            expires_at: { gt: now },
          },
          data: { used_at: now },
          select: { email: true },
        });

      if (!verification) {
        throw new UnauthorizedException("Ссылка недействительна или истекла");
      }

      const { email } = verification;
      const user = await tx.user.upsert({
        where: { email },
        create: { email, email_verified_at: now },
        update: { email },
        select: { id: true, username: true },
      });
      await tx.user.updateMany({
        where: { id: user.id, email_verified_at: null },
        data: { email_verified_at: now, updated_at: now },
      });

      const credentials = await this.sessions.create(tx, user.id, now);
      return { profile: profile(user.username), credentials };
    });
  }

  async getProfile(accessToken: string | undefined): Promise<AuthSession> {
    return profile((await this.sessions.requireUser(accessToken)).username);
  }

  async updateProfile(
    accessToken: string | undefined,
    username: string,
  ): Promise<AuthSession> {
    const user = await this.sessions.requireUser(accessToken);
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { username, updated_at: new Date() },
      select: { username: true },
    });
    return profile(updated.username);
  }
}
