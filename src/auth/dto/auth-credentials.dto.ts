import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Enter email' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Enter password' })
  @MinLength(8, { message: 'Длина пароля должна быть не менее 8 символов' })
  @IsString({ message: 'Name must be a string' })
  password: string;
}
