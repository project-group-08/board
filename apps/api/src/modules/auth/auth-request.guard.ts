import type { IncomingHttpHeaders } from "node:http";

import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type AuthRequest = { headers: IncomingHttpHeaders };

@Injectable()
export class AuthOriginGuard implements CanActivate {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): true {
    const { headers } = context.switchToHttp().getRequest<AuthRequest>();
    const appUrl = this.config.get<string>("APP_URL");
    const url = appUrl ? URL.parse(appUrl) : null;

    if (
      !url ||
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      headers.origin !== url.origin
    ) {
      throw new ForbiddenException("Недопустимый источник запроса");
    }

    return true;
  }
}

@Injectable()
export class AuthJsonGuard implements CanActivate {
  canActivate(context: ExecutionContext): true {
    const { headers } = context.switchToHttp().getRequest<AuthRequest>();
    const mediaType = headers["content-type"]
      ?.split(";", 1)[0]
      ?.trim()
      .toLowerCase();

    if (mediaType !== "application/json") {
      throw new UnsupportedMediaTypeException("Ожидается тело запроса в JSON");
    }

    return true;
  }
}
