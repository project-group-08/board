import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const trustedProxy = app.get(ConfigService).get<string>("TRUSTED_PROXY");
  if (trustedProxy) {
    app.set("trust proxy", trustedProxy);
  }

  app.setGlobalPrefix("api");
  app.enableShutdownHooks();

  await app.listen(4000, "localhost");
}

bootstrap().catch(() => {
  Logger.error("Ошибка запуска API", "Bootstrap");
  process.exitCode = 1;
});
