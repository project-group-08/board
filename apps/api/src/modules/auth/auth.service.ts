import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Mailer } from '@nestjs/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    private readonly emailLinkCooldowns = new Set<string>()
    
    constructor(
        private prismaService: PrismaService,
        private mailer: Mailer,
        private configService: ConfigService,
    ) {}

    async issueEmailLink(email: string, expiresAt: Date): Promise<string> {
        const token = randomBytes(32).toString("base64url");
        const tokenHash = createHash("sha256").update(token).digest();

        await this.prismaService.emailVerificationToken.create({
            data: {
                email: email.toLowerCase(),
                token_hash: new Uint8Array(tokenHash),
                expires_at: expiresAt
            }
        })

        return token;
    }

    async requestEmailLink(email: string): Promise<void> {
        const normalizedEmail = email.toLowerCase();

        if (this.emailLinkCooldowns.has(normalizedEmail)) {
            throw new HttpException(
                "Подождите перед повторной отправкой ссылки",
                HttpStatus.TOO_MANY_REQUESTS
            )
        }

        this.emailLinkCooldowns.add(normalizedEmail);

        setTimeout(() => {
            this.emailLinkCooldowns.delete(normalizedEmail)
        }, 60_000).unref();

        const expiresAt = new Date(Date.now() + 15 * 60_000);
        const token = await this.issueEmailLink(email, expiresAt);

        const link = new URL(
            "/auth/confirm",
            this.configService.getOrThrow<string>("APP_URL"),
        );
        link.hash = new URLSearchParams({ token }).toString();

        await this.mailer.send({
            to: email,
            subject: "Вход в Tabula",
            text: `Перейдите по ссылке для входа: ${link.href}`,
        });
    }
}