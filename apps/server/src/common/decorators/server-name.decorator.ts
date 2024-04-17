import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ServerName = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.session.user.server?.toUpperCase();
  },
);
