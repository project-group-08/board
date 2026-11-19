import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  StandardSchemaValidationPipe,
  UseGuards
} from "@nestjs/common";
import {
    RequestEmailLinkSchema,
    type RequestEmailLink,
} from "@tabula/contracts/http/auth";
import { AuthService } from "./auth.service.js";
import { ThrottlerGuard } from "@nestjs/throttler";


@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('email-link')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestEmailLink(
    @Body({
        schema: RequestEmailLinkSchema,
        pipes: [StandardSchemaValidationPipe]
    })
    body: RequestEmailLink
  ): Promise<void> {
    await this.authService.requestEmailLink(body.email);
  }
}