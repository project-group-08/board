import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const trustedProxy = config.get<string>("TRUSTED_PROXY");
  if (trustedProxy) {
    app.set("trust proxy", trustedProxy);
  }

  app.setGlobalPrefix("api");
  app.enableShutdownHooks();

  const host =
    config.get("NODE_ENV") === "production" ? "0.0.0.0" : "localhost";
  await app.listen(4000, host);
}

bootstrap().catch(() => {
  Logger.error("Ошибка запуска API", "Bootstrap");
  process.exitCode = 1;
});
