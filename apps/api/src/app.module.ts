import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HealthController } from "./common/health.controller.js";
import { AuthModule } from "./modules/auth/auth.module.js";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [HealthController],
})
export class AppModule {}
