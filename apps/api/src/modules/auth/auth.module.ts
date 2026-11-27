import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InMemoryMailTransport, MailModule, SmtpTransport } from "@nestjs/mail";
import { ThrottlerModule } from "@nestjs/throttler";

import { PrismaModule } from "../../prisma/prisma.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { SessionService } from "./session.service.js";

@Module({
  imports: [
    PrismaModule,
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        from: config.get<string>("MAIL_FROM", "no-reply@tabula.test"),
        transport:
          config.get<string>("NODE_ENV") === "test"
            ? new InMemoryMailTransport()
            : new SmtpTransport({
                url: config.get<string>("SMTP_URL", "smtp://127.0.0.1:1025"),
              }),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 5 }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionService],
})
export class AuthModule {}
