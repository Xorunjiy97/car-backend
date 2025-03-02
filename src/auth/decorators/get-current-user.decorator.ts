import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../users/entities';

export const GetCurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return request.user;
  },
);
