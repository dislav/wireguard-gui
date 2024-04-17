import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly password =
    this.configService.get<string>('DASHBOARD_PASSWORD');

  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session.user) {
      throw new UnauthorizedException();
    }

    const isMatch = bcrypt.compareSync(
      session.user.password,
      bcrypt.hashSync(this.password, 10),
    );

    if (!isMatch) {
      throw new BadRequestException();
    }

    return true;
  }
}
