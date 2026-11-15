import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableShutdownHooks();

  await app.listen(4000, "localhost");
}

bootstrap().catch(() => {
  Logger.error("Ошибка запуска API", "Bootstrap");
  process.exitCode = 1;
});
