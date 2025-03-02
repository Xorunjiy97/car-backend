import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { RegisterDto } from './register.dto';

export class ConfirmRegistrationDto extends RegisterDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Введите имя' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Введите пароль' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be more then 8 character' })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
