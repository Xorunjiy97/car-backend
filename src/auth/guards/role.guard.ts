import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/can-be-public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || isPublic) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.some((role: UserRoleEnum) => user?.role === role);
  }
}
