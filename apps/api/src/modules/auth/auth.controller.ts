import type { ServerResponse } from "node:http";

import {
  Body,
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Res,
  StandardSchemaValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import {
  AuthSessionSchema,
  RequestEmailLinkSchema,
  UpdateAuthProfileSchema,
  VerifyEmailLinkSchema,
  type RequestEmailLink,
  type UpdateAuthProfile,
  type VerifyEmailLink,
} from "@tabula/contracts/http/auth";

import { AuthJsonGuard, AuthOriginGuard } from "./auth-request.guard.js";
import { AuthService } from "./auth.service.js";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearSessionCookies,
  readSessionCookie,
  setSessionCookies,
} from "./session-cookies.js";
import { SessionService } from "./session.service.js";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(SessionService) private readonly sessions: SessionService,
  ) {}

  @Post("email-link")
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  requestEmailLink(
    @Body({
      schema: RequestEmailLinkSchema,
      pipes: [StandardSchemaValidationPipe],
    })
    body: RequestEmailLink,
  ) {
    return this.auth.requestEmailLink(body.email);
  }

  @Post("email-link/verify")
  @UseGuards(AuthOriginGuard, AuthJsonGuard, ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Header("Cache-Control", "no-store")
  @ApiOkResponse({ standardSchema: AuthSessionSchema })
  async verifyEmailLink(
    @Body({
      schema: VerifyEmailLinkSchema,
      pipes: [StandardSchemaValidationPipe],
    })
    body: VerifyEmailLink,
    @Res({ passthrough: true }) response: ServerResponse,
  ) {
    const { profile, credentials } = await this.auth.verifyEmailLink(
      body.token,
    );
    setSessionCookies(response, credentials);
    return profile;
  }

  @Post("refresh")
  @UseGuards(AuthOriginGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header("Cache-Control", "no-store")
  async refresh(
    @Headers("cookie") cookie: string | undefined,
    @Res({ passthrough: true }) response: ServerResponse,
  ) {
    const credentials = await this.sessions.refresh(
      readSessionCookie(cookie, REFRESH_COOKIE),
    );
    setSessionCookies(response, credentials);
  }

  @Post("logout")
  @UseGuards(AuthOriginGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header("Cache-Control", "no-store")
  async logout(
    @Headers("cookie") cookie: string | undefined,
    @Res({ passthrough: true }) response: ServerResponse,
  ) {
    await this.sessions.revoke(
      readSessionCookie(cookie, ACCESS_COOKIE),
      readSessionCookie(cookie, REFRESH_COOKIE),
    );
    clearSessionCookies(response);
  }

  @Get("session")
  @Header("Cache-Control", "no-store")
  @ApiOkResponse({ standardSchema: AuthSessionSchema })
  getProfile(@Headers("cookie") cookie: string | undefined) {
    return this.auth.getProfile(readSessionCookie(cookie, ACCESS_COOKIE));
  }

  @Patch("profile")
  @UseGuards(AuthOriginGuard)
  @Header("Cache-Control", "no-store")
  @ApiOkResponse({ standardSchema: AuthSessionSchema })
  updateProfile(
    @Headers("cookie") cookie: string | undefined,
    @Body({
      schema: UpdateAuthProfileSchema,
      pipes: [StandardSchemaValidationPipe],
    })
    body: UpdateAuthProfile,
  ) {
    return this.auth.updateProfile(
      readSessionCookie(cookie, ACCESS_COOKIE),
      body.username,
    );
  }
}
