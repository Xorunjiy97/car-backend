import { UserRoleEnum } from '../enums/user-role.enum';

export interface JwtPayload {
  type?: string;
  sub: number;
  email: string;
  role: UserRoleEnum;
}
