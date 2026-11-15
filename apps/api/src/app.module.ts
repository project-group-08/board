import { Module } from "@nestjs/common";

import { HealthController } from "./common/health.controller.js";

@Module({
  controllers: [HealthController],
})
export class AppModule {}
