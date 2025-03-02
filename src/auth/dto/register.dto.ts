import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Введите email' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Введите пароль' })
  password: string;
}
