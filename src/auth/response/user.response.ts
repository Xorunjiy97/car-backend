import { User } from '../../users/entities';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums/user-role.enum';

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRoleEnum, enumName: 'UserRoleEnum' })
  role: UserRoleEnum;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
  }
}
