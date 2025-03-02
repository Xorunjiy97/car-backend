import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (_: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.sub;
  },
);
